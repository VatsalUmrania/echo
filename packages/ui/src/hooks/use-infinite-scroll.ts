import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps{
    status : "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage"
    loadMore : (numItems: number) => void;
    loadSize?:number;
    observerEnabled?:boolean
}

export const UseInfiniteScroll = ({
    status,
    loadMore,
    loadSize = 10,
    observerEnabled = true
} : UseInfiniteScrollProps ) => {
    
    const topElementRef = useRef<HTMLDivElement>(null);

    const handlerLoadMore = useCallback(()=>{
        if( status === "CanLoadMore"){
            loadMore(loadSize);
        };
    } , [status, loadMore, loadSize]);

    useEffect(() => {
        const topElement = topElementRef.current;
        if (!(topElement && observerEnabled)) {
          return;
        }
      
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              handlerLoadMore();
            }
          },
          { threshold: 0.1 }
        );
      
        observer.observe(topElement);

        return () => {
            observer.disconnect();
        };
      }, [handlerLoadMore, observerEnabled]);
      
      return{
        topElementRef,
        handlerLoadMore,
        canLoadMore : status === "CanLoadMore",
        isLoadingMore : status === "LoadingMore",
        isLoadingFirstPage: status === "LoadingFirstPage",
        isExhausted : status === "Exhausted"
      };
};