/**
 * MeasurementController
 *
 * @description :: Server-side logic for managing Datapoints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
    var data = {}
    if (_.isUndefined(req.param('temperature'))) {
      return res.badRequest('A temperature measurement is required!');
    }
    if (_.isUndefined(req.param('hasWater'))) {
      return res.badRequest('hasWater is required');
    }
    data.temperature = req.param('temperature');
    data.hasWater = req.param('hasWater');
    Measurement.create(data).exec(function(err, createdMeasurement) {
      if (err) {
        return res.negotiate(err);
      }
      return res.created('Measurement successfully created');
    });
  },

  find: function(req, res) {
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
    Measurement.find({ 
      createdAt: { '>': new Date(oneWeekAgo) }
    }).exec(function(err, measurements){    
      if (err) return res.negotiate(err);   
      return res.json(measurements);     
    });    
  }
};

