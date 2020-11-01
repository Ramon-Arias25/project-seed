import React, { Component } from "react";
import ScrollToTop from 'react-scroll-up';
import { FiChevronUp } from "react-icons/fi";
import Helmet from "../component/Helmet";
import Header from "../component/Header";
import Home from "../component/Home";
import FooterTwo from "../component/FooterTwo";

class InteriorLanding extends Component{
    render(){
        return(
            <>
                <Helmet pageTitle="Safty" />
                <Header/>
                <Home />
                <FooterTwo />
                <div className="backto-top">
                    <ScrollToTop showUnder={160}>
                        <FiChevronUp />
                    </ScrollToTop>
                </div>
            </>
        )
    }
}

export default InteriorLanding;