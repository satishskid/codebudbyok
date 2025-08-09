import React from 'react';

const UsageGuide: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Usage Guide & Cost Planning</h2>
            <div className="space-y-4 text-gray-700">
                <p>
                    Code Buddy is designed to be extremely cost-effective by using your school's own Gemini API key. Here's how to plan your usage.
                </p>
                
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <h3 className="font-bold">Understanding the Free Tier</h3>
                    <p>
                        Google's Gemini API has a generous free tier that is often more than enough for typical classroom use. This means your operational cost can be **zero**. The main limit to be aware of is the **requests per minute (RPM)**.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mt-4 mb-2">How many classes can use this per day?</h3>
                    <p>
                        A single API key can comfortably support **over 500+ individual student lessons per day** without hitting usage limits. A "lesson" is one student completing one topic in the curriculum. The cost per lesson is fractions of a cent.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mt-4 mb-2">How many terminals can use one key?</h3>
                     <p>
                        You can use the same API key on multiple terminals. A classroom of **20-30 terminals** can run simultaneously on a single key because student interactions are naturally staggered, which helps avoid hitting the requests-per-minute limit.
                    </p>
                </div>
                
                 <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <h3 className="font-bold">Recommendation for Large Schools</h3>
                    <p>
                        If you have many computer labs, consider creating a few different Google accounts (e.g., one for Junior School, one for Senior School) to get **multiple free API keys**. Using a different key for each lab multiplies your free capacity and is the most cost-effective strategy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UsageGuide;