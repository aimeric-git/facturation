import React from 'react'; 

const HomePage = (props) => {
    return (
        <main className="container pt-5">

            <div className="jumbotron">
                <h1 className="display-3">Hello, world</h1>
                <p className="lead">
                    This is a simple hero unit, a simple jumbotron
                </p>
                <hr className="my-4" />
                <p>
                    It uses utility classes for typography
                </p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" href="#" role="button">
                        Learn more
                    </a>
                </p>
            </div>
        </main>
    );
}

export default HomePage; 