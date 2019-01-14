# WebPPL
[WebPPL](http://webppl.org) is a Probabilistic Programming Language, built over JavaScript. This repository contains gists written in WebPPL that highlight WebPPL's inference capabilities.

## Bayesian Regression
Bayesian regression allows us to estimate parameters as well as the probability density over the parameter space, conditional on training data.
See [bayesian_regression.js](regression/bayesian_regression.js) to see how to perform Bayesian linear regression in WebPPL.  
In our example, when attempting to learn *y = -2x + 20*, we get the following densities over the slope (m) and intercept (c) in *y = mx + c* respectively, showing a good fit.

<p align="center"> 
    <img src="https://github.com/ameya98/WebPPL/blob/master/regression/bayesian_regression_slope.svg" alt="slope density">
    <img src="https://github.com/ameya98/WebPPL/blob/master/regression/bayesian_regression_intercept.svg" alt="intercept density">
</p>

The peaks near *m = -2* and *c = 20* are clear.

## Generative Art
Create procedural trees with d3.js and WebPPL [here](https://ameya98.github.io/WebPPL/generative_art/)! Trees branch off randomly, and branches terminate once thin enough.

## References
* [Probabilistic Models of Cognition](https://probmods.org/)  
* [Modeling Agents with Probabilistic Programs](https://agentmodels.org/)  
* [The Design and Implementation of Probabilistic Programming Languages](http://dippl.org) by N. D. Goodman and A. Stuhlmüller.
