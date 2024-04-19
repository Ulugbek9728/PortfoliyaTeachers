import React from "react";
import { FakultetCardWrapper } from "./FakultetWrapper";
import { useNavigate } from "react-router-dom";
import { imgUrl } from "../../api/general";

const FakultetCard = ({ link, img, menu, icon }) => {
    const navigati = useNavigate(link);

    return (
        <FakultetCardWrapper onClick={() => navigati(link)}>
            <div className="back-color">
                <img
                    src={imgUrl + img}
                    alt="solar batareya"
                    loading={"lazy"}
                    className="back-img"
                />
                <img src={imgUrl + icon} alt="" className="icon" />
                <p>{menu}</p>
            </div>
        </FakultetCardWrapper>
    );
};

export default FakultetCard;
