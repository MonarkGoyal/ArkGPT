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

    if(isAffirmativeFollowUp(input) || isContinuationFollowUp(input)) {
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

        return `I can help with that. Here is a quick way to move forward:

    1) Define your exact goal in one sentence.
    2) Break it into 2-3 smaller steps.
    3) Start with the smallest step now and time-box it for 25 minutes.
    4) Share your result here and I will help refine the next step.

    If you want, tell me your goal and I will give you a tailored action plan.`;
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