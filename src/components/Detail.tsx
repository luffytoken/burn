import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

export const Detail = () => {
    const { txId } = useParams();
    return (
        <Container className="component rounded-4 mt-5">
            <div className="p-4 border-bottom">
                <h4 className="mt-2 mb-0">Transaction Detail</h4>
            </div>
            <div>
                {txId}
            </div>
        </Container>
    )
}