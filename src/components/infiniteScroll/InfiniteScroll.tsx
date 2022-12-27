
export const InfiniteScroll = ({ data, onLoadMore, as }: { data: JSX.Element[], onLoadMore: Function, as: any }) => {
    return <></>;

    // return (
    //     <>{data.map((d, index) => {
    //         if (index < data.length - 1) return d
    //         return <Visibility as={as}
    //             key={d.key}
    //             onBottomVisible={() => onLoadMore()}
    //             once
    //         >{d}</Visibility >
    //     })}</>
    // )
}
