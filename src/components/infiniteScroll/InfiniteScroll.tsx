import { ReactElement } from "react"
import { Card, CardGroup, Visibility } from "semantic-ui-react"

export const InfiniteScroll = ({ data, onLoadMore }: { data: JSX.Element[], onLoadMore: Function }) => (
    <>{data.map((d, index) => {
        if (index < data.length - 1) return d
        return <Visibility as={Card}
            key={d.key}
            onBottomVisible={() => onLoadMore()}
            once={false}
        >{d}</Visibility >
    })}</>
)
