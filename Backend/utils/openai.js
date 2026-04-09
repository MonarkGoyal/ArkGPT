import "dotenv/config";

const getMergeSortReply = (language) => {
    if(language === "java") {
        return `Sure. Here is merge sort in Java:

\`\`\`java
import java.util.Arrays;

public class MergeSort {
    public static void mergeSort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        int mid = arr.length / 2;

        int[] left = Arrays.copyOfRange(arr, 0, mid);
        int[] right = Arrays.copyOfRange(arr, mid, arr.length);

        mergeSort(left);
        mergeSort(right);
        merge(arr, left, right);
    }

    private static void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }

        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }

    public static void main(String[] args) {
        int[] nums = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(nums);
        System.out.println(Arrays.toString(nums));
    }
}
\`\`\`

Time complexity: O(n log n)
Space complexity: O(n)`;
    }

    if(language === "python") {
        return `Sure. Here is merge sort in Python:

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    merged = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

nums = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(nums))
\`\`\`

Time complexity: O(n log n)
Space complexity: O(n)`;
    }

    return `Sure. Here is merge sort in JavaScript:

\`\`\`js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i), right.slice(j));
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
\`\`\`

Time complexity: O(n log n)
Space complexity: O(n)`;
};

const getClosuresReply = () => {
    return `A closure in JavaScript is when a function remembers variables from its outer scope even after the outer function has finished.

Simple example:

\`\`\`js
function createCounter() {
  let count = 0;

  return function () {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`

Why it works: the returned function closes over the variable \`count\`, so it keeps state between calls.`;
};

const getTodoAppReply = () => {
        return `Sure. Here is a simple React todo app you can use right away:

\`\`\`jsx
import { useState } from "react";

export default function App() {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const addTodo = () => {
        const value = todo.trim();
        if (!value) return;
        setTodos([...todos, { id: Date.now(), text: value, done: false }]);
        setTodo("");
    };

    const toggleTodo = (id) => {
        setTodos(todos.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((item) => item.id !== id));
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
            <h1>Todo App</h1>
            <div style={{ display: "flex", gap: 8 }}>
                <input
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    placeholder="Add a task"
                    style={{ flex: 1, padding: 10 }}
                />
                <button onClick={addTodo}>Add</button>
            </div>

            <ul style={{ padding: 0, marginTop: 20, listStyle: "none" }}>
                {todos.map((item) => (
                    <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <input type="checkbox" checked={item.done} onChange={() => toggleTodo(item.id)} />
                        <span style={{ textDecoration: item.done ? "line-through" : "none", flex: 1 }}>
                            {item.text}
                        </span>
                        <button onClick={() => deleteTodo(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// If you want, I can also give you a version with Tailwind, localStorage, or edit mode.

This is a complete starter app, so you can paste it into App.jsx and run it.`;
};

const getExerciseReply = (topic) => {
    return `For ${topic}, keep the work gentle and pain-free. Here are a few general movements that often help with pelvic/hip stability:

1) Pelvic tilts - 10 slow reps.
2) Glute bridges - 2 sets of 10.
3) Clamshells - 2 sets of 12 each side.
4) Bird-dog - 2 sets of 8 each side.
5) Hip flexor stretch - 20 to 30 seconds each side.

Move slowly and stop if pain increases. If this is due to injury, persistent pain, or a diagnosed condition, it is best to check with a physical therapist or doctor first.

If you want, I can turn this into a 5-minute, 10-minute, or 15-minute routine.`;
};

const getGeneralContextReply = (input) => {
    return `For ${input}, the most useful next step is to be more specific about the goal, format, or outcome.

I can help with code, study notes, plans, explanations, or step-by-step guidance. If you tell me the exact result you want, I will answer directly.`;
};

const getBasicMathLessonReply = () => {
    return `Here is a very basic math guide:

1) Addition means combining numbers. Example: 2 + 2 = 4.
2) Subtraction means taking away. Example: 5 - 3 = 2.
3) Multiplication means repeated addition. Example: 3 x 4 = 12.
4) Division means splitting into equal parts. Example: 12 / 3 = 4.
5) Order matters in mixed operations. Use parentheses first, then multiplication/division, then addition/subtraction.

Example:
2 + 3 x 4 = 2 + 12 = 14

If you want, I can also teach fractions, percentages, or basic algebra.`;
};

const stripMathQuestionPrefix = (input) => {
    return (input || "")
        .trim()
        .toLowerCase()
        .replace(/^(what is|what's|whats|calculate|solve|evaluate|compute|find|simplify|what is the value of)\s+/i, "")
        .replace(/[?=]+$/g, "")
        .trim();
};

const isMathLessonRequest = (input) => {
    const normalized = (input || "").toLowerCase();
    return normalized.includes("basic math") ||
        normalized.includes("basic maths") ||
        normalized.includes("math lesson") ||
        normalized.includes("teach me math") ||
        normalized.includes("teach me maths") ||
        normalized.includes("learn math") ||
        normalized.includes("learn maths") ||
        normalized.includes("maths");
};

const isMathExpressionCandidate = (input) => {
    const normalized = stripMathQuestionPrefix(input).replace(/,/g, "");
    return /^[0-9+\-*/().\s]+$/.test(normalized) && /[0-9]/.test(normalized);
};

const evaluateMathExpression = (input) => {
    const expression = stripMathQuestionPrefix(input).replace(/,/g, "");
    if(!/^[0-9+\-*/().\s]+$/.test(expression) || !/[0-9]/.test(expression)) {
        return null;
    }

    let index = 0;

    const skipSpaces = () => {
        while(index < expression.length && /\s/.test(expression[index])) index += 1;
    };

    const parseNumber = () => {
        skipSpaces();
        let start = index;
        let seenDigit = false;
        while(index < expression.length && /[0-9.]/.test(expression[index])) {
            if(/[0-9]/.test(expression[index])) seenDigit = true;
            index += 1;
        }
        if(start === index || !seenDigit) return null;
        return Number(expression.slice(start, index));
    };

    const parseFactor = () => {
        skipSpaces();
        if(expression[index] === "+") {
            index += 1;
            return parseFactor();
        }
        if(expression[index] === "-") {
            index += 1;
            const value = parseFactor();
            return value === null ? null : -value;
        }
        if(expression[index] === "(") {
            index += 1;
            const value = parseExpression();
            skipSpaces();
            if(expression[index] !== ")") return null;
            index += 1;
            return value;
        }
        return parseNumber();
    };

    const parseTerm = () => {
        let value = parseFactor();
        if(value === null) return null;

        while(true) {
            skipSpaces();
            const operator = expression[index];
            if(operator !== "*" && operator !== "/") break;
            index += 1;
            const nextValue = parseFactor();
            if(nextValue === null) return null;
            value = operator === "*" ? value * nextValue : value / nextValue;
        }

        return value;
    };

    function parseExpression() {
        let value = parseTerm();
        if(value === null) return null;

        while(true) {
            skipSpaces();
            const operator = expression[index];
            if(operator !== "+" && operator !== "-") break;
            index += 1;
            const nextValue = parseTerm();
            if(nextValue === null) return null;
            value = operator === "+" ? value + nextValue : value - nextValue;
        }

        return value;
    }

    const result = parseExpression();
    skipSpaces();

    if(result === null || index !== expression.length || Number.isNaN(result) || !Number.isFinite(result)) {
        return null;
    }

    return result;
};

const getMathReply = (input) => {
    const result = evaluateMathExpression(input);
    if(result !== null) {
        const simplified = stripMathQuestionPrefix(input);
        return `\`${simplified}\` = ${Number.isInteger(result) ? result : Number(result.toFixed(6))}`;
    }

    return `Here is a simple math explanation for "${input}":

1) Break the problem into smaller parts.
2) Do the arithmetic step by step.
3) Check the order of operations.

If you send me the exact expression, I can solve it directly.`;
};

const isPercentagePrompt = (input) => {
    const normalized = (input || "").toLowerCase();
    return normalized.includes("percent") || normalized.includes("percentage") || normalized.includes("%");
};

const isFractionPrompt = (input) => {
    const normalized = (input || "").toLowerCase();
    return normalized.includes("fraction") || normalized.includes("fractions") || normalized.includes("numerator") || normalized.includes("denominator");
};

const isAlgebraPrompt = (input) => {
    const normalized = (input || "").toLowerCase();
    return normalized.includes("algebra") || /[a-z]\s*[+-]\s*\d+\s*=/.test(normalized) || /\d+\s*[a-z]\s*[+-]\s*\d+\s*=/.test(normalized) || /solve\s+.*[a-z]/.test(normalized);
};

const isWordProblemPrompt = (input) => {
    const normalized = (input || "").toLowerCase();
    return normalized.includes("word problem") || normalized.includes("word problems") || normalized.includes("story problem") || normalized.includes("real life problem");
};

const getPercentageReply = (input) => {
    const normalized = (input || "").toLowerCase().replace(/,/g, "");
    const match = normalized.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of\s*)?(\d+(?:\.\d+)?)/) || normalized.match(/(\d+(?:\.\d+)?)\s*percent\s+of\s+(\d+(?:\.\d+)?)/);

    if(match) {
        const percent = Number(match[1]);
        const number = Number(match[2]);
        const result = (percent / 100) * number;
        return `\`${percent}% of ${number}\` = ${Number.isInteger(result) ? result : Number(result.toFixed(6))}`;
    }

    return `Percent means "out of 100". A few basics:

1) 50% = 1/2
2) 25% = 1/4
3) 10% = 1/10
4) To find a percent of a number, multiply by the percent as a decimal.

Example: 20% of 50 = 0.2 x 50 = 10

If you send me a specific percentage question, I can calculate it directly.`;
};

const getFractionReply = () => {
    return `Fractions are parts of a whole.

1) The top number is the numerator.
2) The bottom number is the denominator.
3) To add fractions, first use the same denominator.
4) To multiply fractions, multiply top numbers and bottom numbers.

Examples:
1/2 + 1/4 = 2/4 + 1/4 = 3/4
2/3 x 3/5 = 6/15 = 2/5

If you want, I can solve a specific fraction problem for you.`;
};

const getAlgebraReply = (input) => {
    const normalized = stripMathQuestionPrefix(input).replace(/\s+/g, "");
    const match = normalized.match(/^([+-]?\d*\.?\d*)?([a-z])([+-])(\d*\.?\d+)=([+-]?\d*\.?\d+)$/i) || normalized.match(/^([a-z])([+-])(\d*\.?\d+)=([+-]?\d*\.?\d+)$/i);

    if(match) {
        if(match.length === 6) {
            const coefficient = Number(match[1] === "" || match[1] == null ? 1 : match[1]);
            const variable = match[2];
            const operator = match[3];
            const offset = Number(match[4]);
            const rightSide = Number(match[5]);
            const variableValue = operator === "+" ? (rightSide - offset) / coefficient : (rightSide + offset) / coefficient;
            return `Solve for ${variable}: ${normalized.replace(/=/, " = ")}.

${coefficient}${variable} ${operator} ${offset} = ${rightSide}
${coefficient}${variable} = ${operator === "+" ? rightSide - offset : rightSide + offset}
${variable} = ${Number.isInteger(variableValue) ? variableValue : Number(variableValue.toFixed(6))}`;
        }

        const variable = match[1];
        const operator = match[2];
        const offset = Number(match[3]);
        const rightSide = Number(match[4]);
        const variableValue = operator === "+" ? rightSide - offset : rightSide + offset;
        return `Solve for ${variable}:

${variable} ${operator} ${offset} = ${rightSide}
${variable} = ${Number.isInteger(variableValue) ? variableValue : Number(variableValue.toFixed(6))}`;
    }

    return `Algebra is about finding unknowns.

Quick rule:
1) Move numbers to the other side.
2) Do the opposite operation.
3) Keep the equation balanced.

Example:
x + 3 = 7
x = 7 - 3
x = 4

Send me a specific equation and I will solve it directly.`;
};

const getWordProblemReply = (input) => {
    return `For a word problem like "${input}", do this:

1) Identify the numbers.
2) Decide what each number represents.
3) Translate the sentence into an equation.
4) Solve the equation.
5) Check the answer makes sense.

Example:
"I have 3 apples and get 2 more" becomes 3 + 2 = 5.

If you want, send the exact word problem and I will turn it into math for you.`;
};

const isAppBuildRequest = (text) => {
        const normalized = (text || "").toLowerCase();
        const hasBuildVerb = normalized.includes("make") || normalized.includes("build") || normalized.includes("create") || normalized.includes("develop") || normalized.includes("write");
        const hasAppNoun = normalized.includes("app") || normalized.includes("todo") || normalized.includes("task") || normalized.includes("website") || normalized.includes("site") || normalized.includes("page") || normalized.includes("project") || normalized.includes("dashboard") || normalized.includes("calculator") || normalized.includes("game");
        return hasBuildVerb && hasAppNoun;
};

const isExerciseRequest = (text) => {
    const normalized = (text || "").toLowerCase();
    return normalized.includes("exercise") ||
        normalized.includes("exercises") ||
        normalized.includes("workout") ||
        normalized.includes("stretch") ||
        normalized.includes("pain") ||
        normalized.includes("pelvis") ||
        normalized.includes("hip") ||
        normalized.includes("back") ||
        normalized.includes("posture");
};

    const isMathPrompt = (input) => {
        return isMathLessonRequest(input) ||
        isMathExpressionCandidate(input) ||
        isPercentagePrompt(input) ||
        isFractionPrompt(input) ||
        isAlgebraPrompt(input) ||
        isWordProblemPrompt(input) ||
        /^(what is|what's|whats|calculate|solve|evaluate|compute|find|simplify)\b/i.test((input || "").trim().toLowerCase());
    };

const getLearningTipsReply = () => {
    return `Here are practical tips to learn anything faster:

1) Learn in short focused blocks (30-45 min), then take a 5-10 min break.
2) Use active recall: close notes and explain the concept from memory.
3) Practice immediately after learning (small exercises/projects).
4) Use spaced repetition: review after 1 day, 3 days, 7 days, then 14 days.
5) Teach what you learned in simple words (great for clarity).
6) Track weak spots and spend 70% of time fixing them.
7) Keep a daily streak, even if it is only 20 minutes.

If you want, I can create a custom 7-day plan for your exact topic.`;
};

const getSevenDayLearningPlanReply = (topic = "your topic") => {
    return `Perfect. Here is a practical 7-day learning plan for ${topic}:

Day 1: Define your goal and baseline
1) Write one clear goal.
2) List what you already know and what is confusing.
3) Study 45 minutes, then write a short summary from memory.

Day 2: Core concepts only
1) Learn the top 2-3 core concepts.
2) Solve 3 small practice tasks.
3) End with a short self-quiz without notes.

Day 3: Guided practice
1) Build a tiny guided project/tutorial.
2) Pause after each step and predict the next step.
3) Write down 3 mistakes and fixes.

Day 4: Build from scratch
1) Rebuild a mini project without copying.
2) Debug for 15 minutes before checking help.
3) Note all gaps to review later.

Day 5: Strengthen weak areas
1) Spend 70% of time on weak topics.
2) Do spaced revision of previous notes.
3) Teach one concept out loud.

Day 6: Real challenge day
1) Solve 1 medium-level problem/project task.
2) Time-box it to 60-90 minutes.
3) Review solution quality and list improvements.

Day 7: Review and next-step roadmap
1) Re-test yourself on key concepts.
2) Summarize what improved this week.
3) Set your next 7-day plan with a harder goal.

Daily rule: 45-90 minutes focused work, no multitasking, and a short written recap.`;
};

const getStepByStepPlanReply = (topic = "this topic") => {
    return `Great. Here is a step-by-step way to approach ${topic}:

1) Define the end result in one clear sentence.
2) List the 3 core concepts you must understand first.
3) Study one concept, then do one short practice task immediately.
4) Build a tiny example or mini-project.
5) Review mistakes and create a short checklist.
6) Repeat with the next concept until complete.

If you share your exact goal, I can turn this into a custom roadmap.`;
};

const isAffirmativeFollowUp = (text) => {
    const normalized = (text || "").trim().toLowerCase();
    return normalized === "yes" ||
        normalized === "yes do that" ||
        normalized === "yes please" ||
        normalized === "do that" ||
        normalized === "do it" ||
        normalized === "sure" ||
        normalized === "ok" ||
        normalized === "okay" ||
        normalized === "go ahead" ||
        normalized === "please do";
};

const isContinuationFollowUp = (text) => {
    const normalized = (text || "").trim().toLowerCase();
    return normalized === "more" ||
        normalized === "continue" ||
        normalized === "next" ||
        normalized === "go on" ||
        normalized === "elaborate" ||
        normalized === "explain more";
};

const getLastAssistantMessage = (history) => {
    if(!Array.isArray(history) || history.length === 0) return "";
    const previousAssistant = [...history].reverse().find((entry) => entry?.role === "assistant" && typeof entry?.content === "string");
    return previousAssistant?.content || "";
};

const getLastUserTopic = (history) => {
    if(!Array.isArray(history) || history.length === 0) return "your topic";

    const candidates = [...history]
        .reverse()
        .filter((entry) => entry?.role === "user" && typeof entry?.content === "string")
        .map((entry) => entry.content.trim())
        .filter(Boolean)
        .filter((entry) => !isAffirmativeFollowUp(entry) && !isContinuationFollowUp(entry));

    if(candidates.length === 0) return "your topic";
    const topic = candidates[0].replace(/[?.!]+$/g, "");
    return topic.length > 80 ? `${topic.slice(0, 80)}...` : topic;
};

const getOfferDrivenFollowUpReply = (history) => {
    const lastAssistant = getLastAssistantMessage(history).toLowerCase();
    const topic = getLastUserTopic(history);

    if(lastAssistant.includes("7-day plan") || lastAssistant.includes("7 day plan")) {
        return getSevenDayLearningPlanReply(topic);
    }

    if(lastAssistant.includes("step-by-step") || lastAssistant.includes("step by step")) {
        return getStepByStepPlanReply(topic);
    }

    if(lastAssistant.includes("code") || lastAssistant.includes("example") || lastAssistant.includes("algorithm")) {
        return `Great. I can continue with that.

For ${topic}, tell me your preferred language (JavaScript, Python, or Java), and I will provide a complete runnable solution plus explanation.`;
    }

    return getStepByStepPlanReply(topic);
};

const getContextualMessage = (input, history) => {
    if(!Array.isArray(history) || history.length === 0) {
        return input;
    }

    const normalizedInput = input.toLowerCase();
    const previousUser = [...history]
        .reverse()
        .find((entry) => entry?.role === "user" && typeof entry?.content === "string" && entry.content.trim().toLowerCase() !== normalizedInput);

    if(!previousUser) {
        return input;
    }

    const shortFollowUp = input.split(/\s+/).length <= 6;
    if(!shortFollowUp) {
        return input;
    }

    if(isAffirmativeFollowUp(input) || isContinuationFollowUp(input) || isMathPrompt(input)) {
        return input;
    }

    return `${previousUser.content.trim()} ${input}`.trim();
};

const getOfflineAssistantReply = (message, history = []) => {
        const input = (message || "").trim();
        const rawLowered = input.toLowerCase();
        const contextualInput = getContextualMessage(input, history);
        const lowered = contextualInput.toLowerCase();
        const now = new Date();

        if(!input) {
                return "Please share your question, and I will help right away.";
        }

        if(isAffirmativeFollowUp(rawLowered) || isContinuationFollowUp(rawLowered)) {
            return getOfferDrivenFollowUpReply(history);
        }
        if(isMathLessonRequest(rawLowered)) {
            return getBasicMathLessonReply();
        }

        if(isPercentagePrompt(rawLowered)) {
            return getPercentageReply(rawLowered);
        }

        if(isFractionPrompt(rawLowered)) {
            return getFractionReply();
        }

        if(isAlgebraPrompt(rawLowered)) {
            return getAlgebraReply(rawLowered);
        }

        if(isWordProblemPrompt(rawLowered)) {
            return getWordProblemReply(contextualInput || input);
        }

        if(isMathPrompt(rawLowered)) {
            return getMathReply(rawLowered);
        }

        if(rawLowered === "how are you" || rawLowered.includes("how are you")) {
            return "I am good, thanks for asking. How can I help you today?";
        }

        if(rawLowered === "hi" || rawLowered === "hello" || rawLowered === "hey") {
            return "Hey! I am here and ready to help.";
        }

        if(rawLowered === "thanks" || rawLowered === "thank you") {
            return "You are welcome. Happy to help.";
        }

        if(lowered.includes("date") || lowered.includes("today")) {
                return `Today is ${now.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                })}.`;
        }

        if(lowered.includes("time")) {
                return `Current time is ${now.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit"
                })}.`;
        }

        if((lowered.includes("class") || lowered.includes("classes")) && (lowered.includes("javascript") || lowered.includes("js"))) {
                return `Sure. Here is a clear JavaScript classes example:

\`\`\`js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    introduce() {
        return \`Hi, I am \${this.name} and I am \${this.age} years old.\`;
    }
}

class Student extends Person {
    constructor(name, age, course) {
        super(name, age);
        this.course = course;
    }

    study() {
        return \`\${this.name} is studying \${this.course}.\`;
    }
}

const s1 = new Student("Ava", 20, "Computer Science");
console.log(s1.introduce());
console.log(s1.study());
\`\`\`

How it works:
1) class creates a blueprint.
2) constructor runs when creating an object with new.
3) extends enables inheritance.
4) super calls the parent constructor.
5) Methods define behavior shared by all instances.`;
        }

    if((lowered.includes("tip") || lowered.includes("tips") || lowered.includes("learn")) && lowered.includes("javascript")) {
        return `Here are 3 practical tips to learn JavaScript faster:

1) Build small projects every day. Examples: a calculator, to-do list, or simple quiz app.
2) Focus on the fundamentals first: variables, functions, arrays, objects, loops, and async code.
3) Practice reading and debugging code instead of only watching tutorials.

If you want, I can also give you a 7-day JavaScript learning plan.`;
    }

    if(
        lowered.includes("todoapp") ||
        (lowered.includes("todo") && (lowered.includes("app") || lowered.includes("list") || lowered.includes("task"))) ||
        isAppBuildRequest(lowered)
    ) {
        return getTodoAppReply();
    }

    if(isExerciseRequest(lowered)) {
        return getExerciseReply(contextualInput || input);
    }

    if(
        lowered.includes("learn") ||
        lowered.includes("learning") ||
        lowered.includes("study") ||
        lowered.includes("studying") ||
        lowered.includes("focus") ||
        lowered.includes("productivity") ||
        lowered.includes("tips")
    ) {
        return getLearningTipsReply();
    }

    if(lowered.includes("merge sort") || lowered.includes("mergesort")) {
        if(lowered.includes("java")) return getMergeSortReply("java");
        if(lowered.includes("python")) return getMergeSortReply("python");
        return getMergeSortReply("javascript");
    }

    if(lowered.includes("closure") || lowered.includes("closures")) {
        return getClosuresReply();
    }

    if(lowered.includes("code") || lowered.includes("write") || lowered.includes("program") || lowered.includes("javascript") || lowered.includes("python") || lowered.includes("java")) {
        return `Sure. I can help with this.

Please share the exact problem statement, and I will return complete runnable code with explanation.`;
    }

    if(lowered.includes("explain") || lowered.includes("what is") || lowered.startsWith("what ") || lowered.startsWith("how ")) {
        return `Here is the direct explanation for your query: "${contextualInput}".

I can break it down simply, add examples, and show code if needed.`;
    }

        return getGeneralContextReply(contextualInput || input);
};

const getOpenAIAPIResponse = async(message, history = []) => {
    if(!process.env.OPENAI_API_KEY) {
                return getOfflineAssistantReply(message, history);
    }

    const normalizedHistory = Array.isArray(history)
        ? history
            .filter((entry) => (entry?.role === "user" || entry?.role === "assistant") && typeof entry?.content === "string")
            .map((entry) => ({ role: entry.role, content: entry.content }))
            .slice(-12)
        : [];

    const conversation = normalizedHistory.length > 0
        ? normalizedHistory
        : [{ role: "user", content: message }];

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
                role: "system",
                content: "You are a helpful assistant that answers any user query directly, clearly, and concisely."
            }, ...conversation]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        if(!response.ok) {
            const errorBody = await response.text();
            throw new Error(`OpenAI request failed (${response.status}): ${errorBody}`);
        }
        const data = await response.json();
        return data?.choices?.[0]?.message?.content ?? null; //reply
    } catch(err) {
        console.log(err);
        return getOfflineAssistantReply(message, history);
    }
}

export default getOpenAIAPIResponse;