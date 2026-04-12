// External service integrations for enhanced assistant capabilities

const isWeatherQuery = (message = "") => {
    const weatherKeywords = [
        "weather", "temperature", "temp", "forecast", "rain", "snow", "sunny",
        "cloudy", "wind", "humidity", "climate", "degrees", "celsius", "fahrenheit"
    ];
    const lowered = message.toLowerCase();
    return weatherKeywords.some((keyword) => lowered.includes(keyword));
};

const extractLocation = (message = "") => {
    // Simple extraction: look for city names after keywords like "weather in", "in ", "for "
    const patterns = [
        /weather\s+(?:in|for)\s+([a-zA-Z\s]+)/i,
        /(?:in|for)\s+([a-zA-Z\s]+)\s+(?:weather|temperature|forecast)/i,
        /what.*?(?:weather|temperature)\s+(?:in|for)\s+([a-zA-Z\s]+)/i,
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    // Fallback: try to extract a city name (capitalized words)
    const cityPattern = /\b([A-Z][a-z]+)\b/g;
    const matches = message.match(cityPattern);
    return matches ? matches[matches.length - 1] : "London"; // Default fallback
};

const getWeatherResponse = async (message = "") => {
    // Using OpenWeatherMap API - requires API key
    // For demo/offline mode, return a formatted weather response
    const location = extractLocation(message);

    // If no API key, return null so the query falls through to AI (Groq/OpenAI)
    if (!process.env.OPENWEATHER_API_KEY) {
        return null;
    }

    try {
        const encoded = encodeURIComponent(location);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            return `I couldn't find weather data for ${location}. Try a major city name like London, New York, or Tokyo.`;
        }

        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const feels = Math.round(data.main.feels_like);
        const condition = data.weather[0].main;
        const humidity = data.main.humidity;
        const wind = Math.round(data.wind.speed);

        return `Weather in ${data.name}, ${data.sys.country}:

Temperature: ${temp}°C (feels like ${feels}°C)
Condition: ${condition}
Humidity: ${humidity}%
Wind Speed: ${wind} m/s

${condition === "Clear" ? "It's a beautiful day!" : condition === "Rainy" ? "Bring an umbrella!" : "Check local conditions before going out."}`;
    } catch (err) {
        console.log("Weather API error:", err);
        return `I couldn't fetch weather data for ${location}. Please try again or use a weather app for real-time data.`;
    }
};

const isCalculatorQuery = (message = "") => {
    const lowered = message.toLowerCase();

    // Only trigger for actual math expressions, not "what is recursion"
    if (/\d+\s*[+\-*/]\s*\d+/.test(message)) return true;

    // "calculate", "sum of", "add X and Y" etc. with numbers present
    const mathActionWords = ["calculate", "compute", "sum of", "add", "subtract", "multiply", "divide"];
    const hasNumbers = /\d/.test(message);
    return hasNumbers && mathActionWords.some((keyword) => lowered.includes(keyword));
};

const evaluateSimpleMath = (message = "") => {
    // Extract simple math expression (very basic, only for simple arithmetic)
    const match = message.match(/(\d+\.?\d*)\s*([+\-*/])\s*(\d+\.?\d*)/);
    if (!match) return null;

    const [, num1Str, op, num2Str] = match;
    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);

    let result;
    switch (op) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            result = num2 !== 0 ? num1 / num2 : null;
            break;
        default:
            return null;
    }

    return result !== null ? {
        expression: `${num1} ${op} ${num2}`,
        result: Math.round(result * 100) / 100
    } : null;
};

const getCalculatorResponse = (message = "") => {
    const math = evaluateSimpleMath(message);

    if (math) {
        return `${math.expression} = ${math.result}`;
    }

    return `I can help with basic math. Try asking me something like:
- What is 15 + 27?
- Calculate 100 * 0.5
- 42 divided by 6

For complex math, please describe the problem clearly!`;
};

export {
    isWeatherQuery,
    getWeatherResponse,
    isCalculatorQuery,
    getCalculatorResponse,
    extractLocation,
};
