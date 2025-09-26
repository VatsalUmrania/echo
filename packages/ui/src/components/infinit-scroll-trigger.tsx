import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface InfiniteScrollTriggerProps {
    canLoadMore : boolean,
    isLoadingMore : boolean,
    onLoadMore : () => void,
    loadMoreText?: string,
    noMoreText?: string,
    clasName?: string,
    ref?: React.Ref<HTMLDivElement>
}

export const InfiniteScrollTrigger = ({
    canLoadMore,
    isLoadingMore,
    onLoadMore,
    loadMoreText = "Load More",
    noMoreText = "No More items",
    clasName,
    ref
} : InfiniteScrollTriggerProps) => {
    let text = loadMoreText;

    if(isLoadingMore){
        text = "Loading...";
    } else if(!canLoadMore) {
        text = noMoreText;
    }

    return(
        <div className={cn("flex w-full justify-center py-2", clasName)} ref={ref}>
            <Button
                disabled={!canLoadMore || isLoadingMore}
                onClick={onLoadMore}
                size="sm"
                variant="ghost"
            >   
                {text}
            </Button>
        </div>
    )
};