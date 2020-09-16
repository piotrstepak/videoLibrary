const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const dataController = require('../controllers/dataController');
const videoController = require('../controllers/videoController');


router.get('/', homeController.homeRandom);
router.post('/', homeController.search);

router.get('/tag/:id', homeController.tags);
router.post('/tag/:id', homeController.search);

router.get('/add', videoController.add);
router.post('/add', dataController.saveDataToCsv);

router.get('/update/:id', videoController.update);
router.post('/update/:id', dataController.updateDataInCsv);


// router.get('/story', storyController.add);
// router.post('/story', dataController.saveDataToCsv);

// router.get('/story/:id', storyController.update);
// router.post('/story/:id', dataController.updateDataInCsv);

// router.get('/story/:id', (req,res)=>{
//     console.log(req.params['id']);
//     res.json({
//         'id': req.params
//         // 'story': req.body.story
//     });
// })

module.exports = router;