import { deals } from "./homeDealService"
export const HomeDeal = () => {
    return (
        <>
            <div style={{fontSize: '40px'}} className="fw-bolder w-100 text-center">Deal Of The Day</div>
            <div className="d-flex px-5 w-100 justify-content-between mt-3 mb-4">
                            {deals && deals.map((deal) => {
                return (
                    <div key={deal.id}>
                        <img src={deal.image} alt={deal.name} width={200} height={300} className="object-fit-cover"/>
                    </div>
                )
            })}
            </div>
        </>
    )
}