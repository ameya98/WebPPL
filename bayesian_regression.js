/* 
  Bayesian Linear Regression in WebPPL
  Author: Ameya Daigavane
  
  Runnable in WebPPL's online editor at webppl.org  
*/

/* Training Data */
let x_train = _.range(0, 10, 0.1);
let y_train = _.range(20, 0, -0.2);

let sample_uniform = function(){
  return uniform(0, 10);
}

/* 100 samples in the range 0 to 10. */
let x_test = repeat(100, sample_uniform);
let y_test = map(function(x) {return 20 - 2 * x;}, x_test);

/* Linear Regression Model. */
let lr = function() {
  
  /* Prior beliefs. */
  let posterior_m = uniform(-10, 10);
  let posterior_intercept = uniform(0, 100);
  let err_sigma = uniform(0, 0.1);
  
  /* Condition on training data. */
  mapData({data: x_train}, function(x_sample, ind){
    let y_pred = posterior_m * x_sample + posterior_intercept;
    observe(Gaussian({mu: y_pred, sigma:err_sigma}), y_train[ind]);
  });
  
  /* Predictions once conditioned. */
  let predictions = mapData({data: x_test}, function(x_sample){
   return posterior_m * x_sample + posterior_intercept;
  });
  
  return {
    m: posterior_m,
    intercept: posterior_intercept,
    sigma: err_sigma,
    test_predictions: predictions,
  };
};

/* Joint distribution. */
let dist = Infer({method: 'MCMC', samples: 50000}, lr);

/* Marginal distributions. */
let dist_m = marginalize(dist, function(d) { return d.m});
let dist_intercept = marginalize(dist, function(d) { return d.intercept});
let dist_sigma = marginalize(dist, function(d) { return d.sigma});
let dist_preds = marginalize(dist, function(d) { return d.test_predictions});

/* Visualize marginal densities. */
viz.density(dist_m, {bounds: [-5, 0]}); 
viz.density(dist_intercept, {bounds: [0, 100]}); 
viz.density(dist_sigma, {bounds: [0, 0.5]}); 

/* MAP value learned. */
let m_learnt = dist_m.MAP().val;
let intercept_learnt = dist_intercept.MAP().val;
let y_predictions = dist_preds.MAP().val;

display("Slope learnt: " + m_learnt);
display("Intercept learnt: " + intercept_learnt);

/* Residuals over the test set. */
let test_residuals = mapData({data: y_test}, function(__, ind) {
  return Math.sqrt(Math.pow((y_test[ind] - y_predictions[ind]), 2));
}); 

let mean_squared_error = sum(test_residuals) / test_residuals.length;
display("Mean squared error on test data = " + mean_squared_error);