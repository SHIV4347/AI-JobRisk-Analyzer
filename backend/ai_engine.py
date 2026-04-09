import os
import json
import re
from typing import List, Dict, Any
from groq import Groq
from dotenv import load_dotenv

load_dotenv(override=True)

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

# Keyword-based task classifier for fallback and rule adjustments
REPETITIVE_KEYWORDS = [
    "data entry", "filing", "scheduling", "copy", "paste", "invoicing",
    "processing", "sorting", "scanning", "monitoring", "tracking", "reporting",
    "updating records", "logging", "calculating", "transcribing", "payroll",
    "inventory", "form filling", "order processing", "quality checking",
]

CREATIVE_KEYWORDS = [
    "design", "create", "innovate", "strategy", "write", "compose",
    "develop", "ideate", "brainstorm", "architect", "plan", "research",
    "analyse", "analyze", "evaluate", "invent", "craft", "produce",
    "market", "brand", "storytell", "conceptual",
]

HUMAN_INTERACTION_KEYWORDS = [
    "counsel", "coach", "mentor", "negotiate", "lead", "manage people",
    "communicate", "empathize", "facilitate", "collaborate", "interview",
    "consult", "advise", "present", "train", "motivate", "resolve conflict",
    "customer service", "sales", "therapy", "teach", "supervise",
]

# Tools considered "modern / protective" (reduce risk)
MODERN_TOOLS = [
    "python", "r", "sql", "machine learning", "ai", "artificial intelligence",
    "automation", "tensorflow", "pytorch", "spark", "hadoop", "kubernetes",
    "docker", "git", "github", "tableau", "power bi", "dbt", "airflow",
    "scikit-learn", "pandas", "numpy", "langchain", "openai", "gemini",
    "copilot", "gpt", "llm", "javascript", "typescript", "react", "node",
    "java", "scala", "rust", "go", "golang",
]


def classify_task(task: str) -> str:
    task_lower = task.lower()
    repetitive_hits = sum(1 for kw in REPETITIVE_KEYWORDS if kw in task_lower)
    creative_hits = sum(1 for kw in CREATIVE_KEYWORDS if kw in task_lower)
    human_hits = sum(1 for kw in HUMAN_INTERACTION_KEYWORDS if kw in task_lower)

    if repetitive_hits >= creative_hits and repetitive_hits >= human_hits:
        return "repetitive"
    elif creative_hits >= human_hits:
        return "creative"
    else:
        return "human_interaction"


def get_replaceability(category: str, task_score: int) -> str:
    if task_score >= 70:
        return "High"
    elif task_score >= 40:
        return "Medium"
    else:
        return "Low"


def get_risk_level(score: int) -> str:
    if score >= 70:
        return "High Risk"
    elif score >= 40:
        return "Medium Risk"
    else:
        return "Low Risk"


def uses_modern_tools(tools: List[str]) -> bool:
    """Return True if the tools list contains any modern/AI/automation tools."""
    tools_lower = [t.lower() for t in tools]
    for tool in tools_lower:
        for modern in MODERN_TOOLS:
            if modern in tool:
                return True
    return False


def apply_rule_adjustments(
    base_score: int,
    task_categories: List[str],
    experience_level: str = "",
    tools_used: List[str] = None,
    decision_making: str = "",
) -> int:
    """
    Apply deterministic rule-based adjustments on top of the AI base score.

    Adjustments:
    - Experience: +15 if "0-2", -15 if "10+"
    - Tasks: +20 if majority repetitive, -20 if majority creative/strategic
    - Decision Making: -10 if "High", -5 if "Medium"
    - Tools: +10 if no modern tools, -10 if modern/AI/automation tools present
    """
    if tools_used is None:
        tools_used = []

    total = len(task_categories)
    adjustment = 0

    if experience_level == "0-2":
        adjustment += 15
    elif experience_level == "10+":
        adjustment -= 15

    if total > 0:
        repetitive_count = task_categories.count("repetitive")
        creative_count = task_categories.count("creative")
        human_count = task_categories.count("human_interaction")

        if repetitive_count / total > 0.5:
            adjustment += 20
        elif (creative_count + human_count) / total > 0.5:
            adjustment -= 20

    if decision_making == "High":
        adjustment -= 10
    elif decision_making == "Medium":
        adjustment -= 5

    if tools_used and uses_modern_tools(tools_used):
        adjustment -= 10
    elif not tools_used or not uses_modern_tools(tools_used):
        adjustment += 10

    final = base_score + adjustment
    return max(0, min(100, final))  # clamp 0–100


def build_prompt(
    job_title: str,
    tasks: List[str],
    experience_level: str,
    tools_used: List[str],
    decision_making: str,
) -> str:
    tasks_str = "\n".join(f"- {t}" for t in tasks)
    tools_str = ", ".join(tools_used) if tools_used else "None specified"

    return f"""You are an AI automation risk analyst. Analyze the job role below and return a structured JSON response.

Job Title: {job_title}
Experience Level: {experience_level} years
Tools Used: {tools_str}
Decision-Making Autonomy: {decision_making}

Daily Tasks:
{tasks_str}

Consider the following when scoring:
1. Experience level: Junior roles (0-2 yrs) tend to be more automatable; senior roles (10+) less so.
2. Tools: Roles that already use AI, automation, or programming languages are less vulnerable.
3. Decision-making: High autonomy work (strategy, judgment, leadership) is harder to automate.
4. Task nature: Repetitive, rule-based tasks are highest risk; creative and human-interaction tasks are lowest.

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{{
  "base_risk_score": <integer 0-100>,
  "task_analysis": [
    {{
      "task": "<exact task text>",
      "category": "<repetitive|creative|human_interaction>",
      "task_risk_score": <integer 0-100>,
      "reasoning": "<one sentence>"
    }}
  ],
  "recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>",
    "<actionable recommendation 4>",
    "<actionable recommendation 5>"
  ],
  "skills_to_learn": [
    "<skill 1>",
    "<skill 2>",
    "<skill 3>",
    "<skill 4>"
  ]
}}
"""


def analyze_job_with_ai(
    job_title: str,
    tasks: List[str],
    experience_level: str = "3-5",
    tools_used: List[str] = None,
    decision_making: str = "Medium",
) -> Dict[str, Any]:
    """
    Main AI analysis function with Groq and Mock fallback.
    """
    if tools_used is None:
        tools_used = []

    if not client:
        return get_mock_analysis(job_title, tasks, experience_level, tools_used, decision_making)

    try:
        prompt = build_prompt(job_title, tasks, experience_level, tools_used, decision_making)

        # Call Groq AI service
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an AI automation risk analyst. Always return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )

        raw_content = completion.choices[0].message.content.strip()
        ai_data = json.loads(raw_content)

        base_score = int(ai_data.get("base_risk_score", 50))
        task_analysis_raw = ai_data.get("task_analysis", [])
        recommendations = ai_data.get("recommendations", [])
        skills_to_learn = ai_data.get("skills_to_learn", [])

        # Apply rule-based overrides safely
        task_categories = []
        task_analysis_final = []

        for item in task_analysis_raw:
            category = item.get("category", classify_task(item.get("task", "")))
            task_score = int(item.get("task_risk_score", 50))
            replaceability = get_replaceability(category, task_score)
            task_categories.append(category)
            task_analysis_final.append({
                "task": item.get("task", ""),
                "category": category,
                "replaceability": replaceability,
                "risk_score": task_score,
            })

        final_score = apply_rule_adjustments(
            base_score, task_categories, experience_level, tools_used, decision_making
        )
        risk_level = get_risk_level(final_score)

        return {
            "risk_score": final_score,
            "risk_level": risk_level,
            "task_analysis": task_analysis_final,
            "recommendations": recommendations,
            "skills_to_learn": skills_to_learn,
            "raw_ai_response": ai_data,
        }
    except Exception as e:
        return get_mock_analysis(job_title, tasks, experience_level, tools_used, decision_making)


def get_mock_analysis(
    job_title: str,
    tasks: List[str],
    experience_level: str = "3-5",
    tools_used: List[str] = None,
    decision_making: str = "Medium",
) -> Dict[str, Any]:
    """Fallback mock data to ensure the app always works."""
    if tools_used is None:
        tools_used = []

    task_analysis = []
    task_categories = []

    for t in tasks:
        cat = classify_task(t)
        score = 85 if cat == "repetitive" else 30
        task_analysis.append({
            "task": t,
            "category": cat,
            "replaceability": get_replaceability(cat, score),
            "risk_score": score
        })
        task_categories.append(cat)

    final_score = apply_rule_adjustments(65, task_categories, experience_level, tools_used, decision_making)

    return {
        "risk_score": final_score,
        "risk_level": get_risk_level(final_score),
        "task_analysis": task_analysis,
        "recommendations": [
            "Learn AI-assisted tools for your industry.",
            "Focus on leadership and strategic planning.",
            "Upskill in data analysis and technical oversight.",
            "Develop stronger soft skills and emotional intelligence.",
            "Stay updated on the latest automation trends.",
        ],
        "skills_to_learn": ["AI Prompt Engineering", "Strategic Analytics", "Team Leadership", "Digital Literacy"],
        "raw_ai_response": {"mode": "mock"},
    }
