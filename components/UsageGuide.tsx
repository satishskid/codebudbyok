export function UsageGuide() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Using This Application Effectively</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-700">Getting Started:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>The application remembers your settings between sessions</li>
            <li>No need to re-enter information unless you switch devices</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-700">Best Practices:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Keep the browser tab open during active use</li>
            <li>Avoid using the back button during conversations</li>
            <li>Save important information externally if needed</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-700">What to Expect:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Internet interruptions will pause responses</li>
            <li>Refreshing may clear recent conversation history</li>
            <li>Some features require an active internet connection</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-700">Troubleshooting:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>If stuck, try refreshing the page</li>
            <li>For persistent issues, close and reopen the application</li>
            <li>Contact support if problems continue</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-700">For Shared Computers:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Always log out when finished</li>
            <li>Be aware others may see your previous activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}