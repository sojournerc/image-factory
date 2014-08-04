var gm = require('gm'),
  _ = require('lodash'),
  thunk = require('thunkify'),
  fs = require('fs');

// image magick is more lightweight and works
// more consistently, so use the npm plugin's subclass
var im = gm.subClass({ imageMagick: true });

var ImageFactory = module.exports = function (opts) {
  opts = this.opts = _.extend({}, {
    dirOut: '/images',
    formatsExcepted: ['jpg','png','gif'],
    variants: [
      { name: 'thumb', resize: 'CROP', w: 150, h: 150 }, 
      { name: 'small', resize: 'FIT', w: 340, h: 1024 }, 
      { name: 'medium', resize: 'FIT', w: 600, h: 1024 },
      { name: 'large', resize: 'FIT', w: 1024, h: 1024 }, 
      { name: 'xlarge', resize: 'FIT', w: 2560, h: 2560 }
    ]
  }, opts);
};

ImageFactory.prototype.create = function*(pathIn) {
  file = thunk(fs.readFile);
  if (!this.validatePath(pathIn)) { 
    return new TypeError('Sorry, we only accept these image formats:\n' + this.opts.formatsExcepted.join(', ')); 
  }   
  
  var img = yield file(pathIn);
  return img;
};

ImageFactory.prototype.getImageOutPath = function() {
  // body...
};

ImageFactory.prototype.validatePath = function(path) {
  // console.log(this.opts);
  return false;
};

//   function getImageUrl(variant_name) {
//     return IMAGE_DIRECTORY + '/' + subdir + '/' + id + '.' + variant_name + ext;
//   }

//   function getImagePath(variant_name) {
//     return __dirname + getImageUrl(variant_name);
//   }

//   function createVariants(image) {
//     var var_prom = await.apply(this, _.map(variants, function(v) {
//       return v.name;
//     }));

//     function resize(variant, file_name) {
//       if (variant.resize === 'CROP') {
//         im(file_name).thumb(variant.w, variant.h, file_name, 100, function(err) {
//           if (err) { var_prom.fail(err); }
//           var_prom.keep(variant.name, {
//             url: getImageUrl(variant.name),
//             w: variant.w,
//             h: variant.h
//           });
//         });
//       } else if (variant.resize === 'FIT') {
//         im(file_name)
//           .resize(variant.w, variant.h)
//           .write(file_name, function(err) {
//             if (err) { var_prom.fail(err); }
//             // get size of new image and return 
//             im(file_name).size(function(err, value) {
//               var_prom.keep(variant.name, {
//                 url: getImageUrl(variant.name),
//                 w: value.width,
//                 h: value.height
//               });
//             });
//           });
//       }
//     }

//     _.each(variants, function(variant) {
//       if (image.h >= variant.h || image.w >= variant.w) {

//         // create file
//         var file_name = getImagePath(variant.name);
//         fs.readFile(getImagePath('orig'), function (err, data) {
//             if (err) var_prom.fail(err);
//             fs.writeFile(file_name, data, function (err) {
//                 if (err) var_prom.fail(err);
//                 resize(variant, file_name);
//             });
//         });

//       } else {
//         var_prom.keep(variant.name, false);
//       }
//     });

//     return var_prom;
//   }

//   return await('image').run(function (prom) { 
//     var path = getImagePath('orig');
//     // rename the original and move
//     fs.renameSync(req.files.image.path, path);
//     // get the size of the original
//     im(path).size(function(err, value) {
//       if (err) { prom.fail(err); }
//       var orig = {
//         url: getImageUrl('orig'),
//         w: value.width,
//         h: value.height
//       };
//       createVariants(orig).onkeep(function(got){
//         var image = {
//           orig_name: req.files.image.name,
//           variants: {
//             orig: orig
//           }
//         };

//         for (var i in got) {
//           if (got.hasOwnProperty(i)) {
//             if (got[i]) {
//               image.variants[i] = got[i];
//             }
//           }
//         }

//         prom.keep('image', image);
//       }).onfail(function (err) {
//         prom.fail(err);
//       });
//     });
//   });
// }

// serveImage = function(req, res) {
//   fs.readFile(__dirname + req.originalUrl, "binary", function(err, file) {
//     if (err) {
//       new Resource.Error(res, 404, "media not found");
//     } else {
//       var type = req.originalUrl.split('.').pop();
//       res.writeHead(200, {
//         "Content-Type": "image/" + type
//       });
//       res.write(file, "binary");
//       res.end();
//     }
//   });
// };

// module.exports = {
//   storeImage: storeImage,
//   serveImage: serveImage
// };