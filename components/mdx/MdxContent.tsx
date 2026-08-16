import * as React from "react"
import { MDXRemote } from "next-mdx-remote/rsc"

// Example custom components
const Callout = ({ children, type = "default" }: { children: React.ReactNode; type?: "default" | "warning" | "error" }) => (
  <div className={`p-4 rounded-lg my-4 border ${
    type === "warning" ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-800 dark:text-yellow-200" :
    type === "error" ? "bg-red-500/10 border-red-500/50 text-red-800 dark:text-red-200" :
    "bg-muted border-border"
  }`}>
    {children}
  </div>
)

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="p-4 rounded-lg bg-black text-white overflow-x-auto my-4 text-sm font-mono">
    {children}
  </pre>
)

const components = {
  Callout,
  pre: CodeBlock,
  // Add other standard mappings here
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="my-4 leading-7 text-muted-foreground" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 my-4" {...props} />,
  li: (props: any) => <li className="my-2" {...props} />,
  a: (props: any) => <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />,
}

interface MdxContentProps {
  source: string
}

export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
