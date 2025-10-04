// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@workspace/ui/components/resizable";
// import { ConversationsPanel } from "@/modules/dashboard/ui/components/conversations-panel";

// export const ConversationsLayout = ({
//   children,
// }: { children: React.ReactNode; }) => {
//   return (
//     <ResizablePanelGroup className="h-full flex" direction="horizontal">
//       <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
//         <ConversationsPanel />
//       </ResizablePanel>
//       <ResizableHandle />
//       <ResizablePanel className="flex flex-col" defaultSize={70}>
//         {children}
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );
// };


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ConversationsPanel } from "@/modules/dashboard/ui/components/conversations-panel";

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ResizablePanelGroup
      className="h-full w-full"
      direction="horizontal"
    >
      <ResizablePanel
        defaultSize={100}  // Start with full width
        maxSize={100}
        minSize={30}
        className="min-w-[320px]"  // Only set minimum, no maximum
      >
        <ConversationsPanel />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel 
        defaultSize={0}    // Start collapsed
        minSize={0}
        maxSize={70}
      >
        <div className="h-full w-full overflow-auto bg-background">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
