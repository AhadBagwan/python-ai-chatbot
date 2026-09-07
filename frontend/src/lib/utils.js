import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  // Less than a minute
  if (diff < 60000) return 'Just now';
  
  // Less than an hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Default to date string
  return d.toLocaleDateString();
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportChatToMarkdown(messages, title = 'AhadNova AI Chat') {
  let markdown = `# ${title}\n\n`;
  markdown += `*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
  
  messages.forEach(msg => {
    const role = msg.role === 'user' ? '**You**' : '**AhadNova AI**';
    markdown += `${role}:\n\n${msg.content}\n\n---\n\n`;
  });
  
  return markdown;
}

export function exportChatToJSON(messages, metadata = {}) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    ...metadata,
    messages
  }, null, 2);
}

export function exportToPDF(chat) {
  // Simple PDF export using print
  const content = chat.messages.map(msg => {
    const role = msg.role === 'user' ? 'You' : 'AhadNova AI';
    return `${role}:\n${msg.content}\n\n`;
  }).join('---\n\n');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${chat.title || 'AhadNova AI Chat'}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #00f0ff; }
          pre { white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>${chat.title || 'AhadNova AI Chat'}</h1>
        <p><em>Exported on ${new Date().toLocaleString()}</em></p>
        <hr>
        <pre>${content}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

export function exportToMarkdown(chat) {
  const markdown = exportChatToMarkdown(chat.messages, chat.title);
  downloadFile(markdown, `${chat.title || 'chat'}.md`, 'text/markdown');
}

export function exportToJSON(chat) {
  const json = exportChatToJSON(chat.messages, { title: chat.title });
  downloadFile(json, `${chat.title || 'chat'}.json`, 'application/json');
}
