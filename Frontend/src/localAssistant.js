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

const getBubbleSortReply = (language) => {
    if(language === "python") {
        return `Sure. Here is bubble sort in Python:

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

nums = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(nums))
\`\`\`

Time complexity: O(n^2)
Space complexity: O(1)`;
    }

    if(language === "java") {
        return `Sure. Here is bubble sort in Java:

\`\`\`java
import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] nums = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(nums);
        System.out.println(Arrays.toString(nums));
    }
}
\`\`\`

Time complexity: O(n^2)
Space complexity: O(1)`;
    }

    return `Sure. Here is bubble sort in JavaScript:

\`\`\`js
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
\`\`\`

Time complexity: O(n^2)
Space complexity: O(1)`;
};

const getContextualMessage = (input, history) => {
    if(!Array.isArray(history) || history.length === 0) {
        return input;
    }

    const normalizedInput = input.toLowerCase();
    const previousUserMessage = [...history]
        .reverse()
        .find((entry) => entry?.role === "user" && typeof entry?.content === "string" && entry.content.trim().toLowerCase() !== normalizedInput);

    if(!previousUserMessage) {
        return input;
    }

    const isShortFollowUp = input.split(/\s+/).length <= 6;
    if(!isShortFollowUp) {
        return input;
    }

    return `${previousUserMessage.content.trim()} ${input}`.trim();
};

const getLocalAssistantReply = (message, history = []) => {
    const input = (message || "").trim();
    const rawLowered = input.toLowerCase();
    const contextualInput = getContextualMessage(input, history);
    const lowered = contextualInput.toLowerCase();
    const now = new Date();

    if(!input) {
        return "Please share your question, and I will help right away.";
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
        return "Hi, I am " + this.name + " and I am " + this.age + " years old.";
    }
}

class Student extends Person {
    constructor(name, age, course) {
        super(name, age);
        this.course = course;
    }

    study() {
        return this.name + " is studying " + this.course + ".";
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

    if(lowered.includes("merge sort") || lowered.includes("mergesort")) {
        if(lowered.includes("java")) return getMergeSortReply("java");
        if(lowered.includes("python")) return getMergeSortReply("python");
        return getMergeSortReply("javascript");
    }

    if(lowered.includes("bubble sort") || lowered.includes("bubblesort") || (lowered.includes("sort") && lowered.includes("bubble"))) {
        if(lowered.includes("java")) return getBubbleSortReply("java");
        if(lowered.includes("python")) return getBubbleSortReply("python");
        return getBubbleSortReply("javascript");
    }

    if(lowered.includes("closure") || lowered.includes("closures")) {
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

    Why it works: the returned function closes over the variable "count", so it keeps state between calls.`;
    }

    if(lowered.includes("code") || lowered.includes("write") || lowered.includes("program") || lowered.includes("javascript") || lowered.includes("python") || lowered.includes("java") || lowered.includes("example")) {
        return `Sure. Here is a simple code example you can use as a starting point:

\`\`\`js
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));
\`\`\`

If you want a specific algorithm, share the name of the problem and I will give that exact code.`;
    }

    if(lowered.includes("explain") || lowered.includes("what is") || lowered.startsWith("what ") || lowered.startsWith("how ")) {
        return `Here is the direct explanation for your query: "${contextualInput}".

I can break it down simply, add examples, and show code if needed.`;
    }

    return `Here is a direct response to your query: "${input}".

I can help with explanations, summaries, coding, debugging, and step-by-step guidance. If you want a deeper or more specific answer, ask a follow-up and I will refine it.`;
};

export default getLocalAssistantReply;