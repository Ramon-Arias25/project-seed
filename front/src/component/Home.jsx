import React from 'react';

const SlideList = [
    {
        textPosition: 'text-center',
        category: '',
        title: 'safty',
        description: 'Es el lugar donde rescatistas, familias y entusiastas de las mascotas unen esfuerzos para darles un hogar',
        buttonText: 'Sign Up',
        buttonLink: '#'
    }
]

const Home = () => {
    return (
        <div className="slider-activation slider-creative-agency" id="home">
            <div className="bg_image bg_image--29" data-black-overlay="4">
                {SlideList.map((value, index) => (
                    <div className="slide slide-style-2 slider-paralax d-flex align-items-center justify-content-center" key={index}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className={`inner ${value.textPosition}`}>
                                        {value.category ? <span>{value.category}</span> : ''}
                                        {value.title ? <h1 className="title theme-gradient">{value.title}</h1> : ''}
                                        {value.description ? <p className="description">{value.description}</p> : ''}
                                        {value.buttonText ? <div className="slide-btn"><a className="rn-button-style--2 btn-primary-color" href={`${value.buttonLink}`}>{value.buttonText}</a></div> : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Home;