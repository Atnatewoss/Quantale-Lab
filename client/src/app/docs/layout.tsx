import docsConfig from "@/docs.config";
import { createNextDocsLayout, createNextDocsMetadata } from "@farming-labs/next/layout";
import { RootProvider } from "@farming-labs/theme";

export const metadata = createNextDocsMetadata(docsConfig);

const DocsLayout = createNextDocsLayout(docsConfig);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <div className="docs-route-shell">
        <DocsLayout>{children}</DocsLayout>
      </div>
    </RootProvider>
  );
}
