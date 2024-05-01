import React from 'react';
import "../../style/fakultetListe.css"

function FakultetList(props) {
    return (
        <div className='container'>
            <div className="row">
                <div className="buttons">
                    <button className="neumorphic">
                        <i className="fa-light fa-fire"></i>
                        <span>Button 1</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-dna"></i>
                        <span>Button 2</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-chart-mixed"></i>
                        <span>Button 3</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-atom"></i>
                        <span>Button 4</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-seedling"></i>
                        <span>Button 5</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-disease"></i>
                        <span>Button 6</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-seedling"></i>
                        <span>Button 7</span>
                    </button>
                    <button className="neumorphic">
                        <i className="fa-light fa-disease"></i>
                        <span>Button 8</span>
                    </button>
                </div>
            </div>

        </div>
    );
}

export default FakultetList;