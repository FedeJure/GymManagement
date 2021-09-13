import { ReactElement } from "react"
import { CardGroup, Visibility } from "semantic-ui-react"

export const InfiniteScroll = ({ data, onLoadMore }: { data: JSX.Element[], onLoadMore: Function }) => (
    <>{data.map((d, index) => {
        if (index < data.length - 1) return d
        return <Visibility
            key={d.key}
            onBottomVisible={() => onLoadMore()}
            once={false}
        >{d}</Visibility >
    })}</>
)
