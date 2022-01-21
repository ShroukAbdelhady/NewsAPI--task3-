const express = require('express')
const router = express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth')

router.post('/addNews', auth, async (req, res) => {
    try {
        const news = new News({ ...req.body, reporter: req.user._id })
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(400).send(e.message)
    }
})
router.get('/getNews/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOne({ _id, reporter: req.user._id })
        if (!news) {
            return res.status(404).send(' unable to find this title ')
        }
        res.status(200).send(news)
    } catch (e){
        res.status(500).send(e.message)
    }
})
router.get('/getMyNews', auth, async (req, res) => {
    try {
         await req.user.populate('news')
        res.status(200).send(req.user.news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
router.patch('/updateNews/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findByIdAndUpdate({ _id, reporter: req.user._id }, req.body, {
            new: true
        })
        if (!news) {
            return res.status(404).send(' unable to find this title ')
        }
        res.status(200).send(news)
    }catch(e){
        res.status(400).send(e.message)
    }
})
router.delete('/removeNews/:id', auth, async (req, res) => {
         const _id = req.params.id
         try{
               const news = await News.findByIdAndDelete({_id, reporter:req.user._id})
               if(!news){
                   return res.status(404).send(' unable to find this title')
               }
               res.status(200).send(news)
         }catch(e){
             res.status(400).send(e.message)
         }
})
module.exports = router