import React, { useEffect, useRef, useState } from "react";

export default function MermaidRenderer({ chart }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        if (!window.mermaid) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
            script.onload = () => {
              window.mermaid.initialize({
                startOnLoad: false,
                theme: "dark",
                securityLevel: "loose",
              });
              resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await window.mermaid.render(id, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Diagram formatting error");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="my-4 p-4 rounded-xl bg-[#18181b] border border-[rgba(255,255,255,0.08)] shadow-xs overflow-x-auto">
      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa] mb-3 border-b border-[rgba(255,255,255,0.06)] pb-2 flex items-center justify-between">
        <span>Architecture & Protocol Diagram</span>
        <span className="badge-pill badge-indigo">Mermaid Vector</span>
      </div>

      {error ? (
        <pre className="text-xs text-[#f87171] font-mono p-3 bg-[#ef4444]/10 rounded-lg border border-[#ef4444]/25">
          {error}
        </pre>
      ) : svgContent ? (
        <div className="flex justify-center items-center py-2" dangerouslySetInnerHTML={{ __html: svgContent }} />
      ) : (
        <div className="text-xs font-mono text-[#71717a] py-6 text-center animate-pulse">
          Rendering vector architecture diagram...
        </div>
      )}
    </div>
  );
}
