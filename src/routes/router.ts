//@ts-nocheck

import express from 'express'
import { isAdminAuth } from '../middleware/isAuth'
import { logIn, logOut, signUp, resetPassword, editUser, deleteUser, indexUsers, getSystemData, getProfileData, passwordResetCustomer } from '../controllers/UserController'
import { authAdminPage, logInAdmin, logOutAdmin, signUpAdmin, getAdminSettingsData, forgotAdminPassword, resetAdminPassword, updateAdminSettingsData, updateAdminAccountData } from '../controllers/admin/adminController'
import { postReview } from '../controllers/reviewController'
import { addCategory, editCategory, deleteCategory, indexCategories } from '../controllers/admin/categoryController'
import { createOrder, changeOrderStatus, indexOrders, editOrder, deleteOrder } from '../controllers/admin/orderController'
import { createSlider, editSlider, deleteSlider, indexSliders } from '../controllers/admin/sliderController'
import { createAddon, editAddon, deleteAddon, indexAddons, getAddons } from '../controllers/admin/addonController'
import { createEmployeeAccount, editEmployeeAccount, deleteEmployeeAccount } from '../controllers/admin/employeeController'
import { createItem, editItem, deleteItem, indexItems, getSingleItem } from '../controllers/admin/itemController'
import { createBanner, editBanner, deleteBanner, indexBanners } from '../controllers/admin/bannerController'
import { addPromotion, editPromotion, deletePromotion, indexPromotions } from '../controllers/admin/promotionController'
import { placeOrder, getOrders } from '../controllers/orderController'
export const router = express.Router()

// -------------------------- BACKEND ROUTES -------------------------- // 

// AUTH ROUTES

router.post('/admin/signup', signUpAdmin)
router.post('/admin/login', logInAdmin)
router.post('/admin/logout', logOutAdmin)
router.post('/admin/forgot-password', forgotAdminPassword)
router.post('/admin/reset-password/:token/:system', resetAdminPassword)

// END AUTH ROUTES

router.post('/admin/settings', isAdminAuth, getAdminSettingsData)
router.post('/admin/settings/update', isAdminAuth, updateAdminSettingsData)

router.post('/admin/login', logInAdmin)
router.get('/admin/dashboard', isAdminAuth, authAdminPage)
router.post('/admin/account/update', isAdminAuth, updateAdminAccountData)

router.post('/admin/employee/create', isAdminAuth, createEmployeeAccount)
router.post('/admin/employee/edit', isAdminAuth, editEmployeeAccount)
router.post('/admin/employee/delete', isAdminAuth, deleteEmployeeAccount)

router.post('/admin/slider/add', isAdminAuth, createSlider)
router.post('/admin/slider/edit', isAdminAuth, editSlider)
router.post('/admin/slider/delete', isAdminAuth, deleteSlider)
router.post('/admin/sliders', isAdminAuth, indexSliders)

router.post('/admin/category/add', isAdminAuth, addCategory)
router.post('/admin/category/edit', isAdminAuth, editCategory)
router.post('/admin/category/delete', isAdminAuth, deleteCategory)
router.post('/admin/categories', isAdminAuth, indexCategories)

router.post('/admin/addon/add', isAdminAuth, createAddon)
router.put('/admin/addon/edit', isAdminAuth, editAddon)
router.post('/admin/addon/delete', isAdminAuth, deleteAddon)
router.post('/admin/addons', isAdminAuth, indexAddons)

router.post('/admin/order/new', isAdminAuth, createOrder)
router.post('/admin/order/edit', isAdminAuth, editOrder)
router.post('/admin/order/orderstatus', isAdminAuth, changeOrderStatus)
router.post('/admin/order/delete', isAdminAuth, deleteOrder)
router.post('/admin/orders', isAdminAuth, indexOrders)

router.post('/admin/item/add', isAdminAuth, createItem)
router.post('/admin/item/edit', isAdminAuth, editItem)
router.post('/admin/item/delete', isAdminAuth, deleteItem)
router.post('/admin/items', isAdminAuth, indexItems)

router.post('/admin/banner/add', isAdminAuth, createBanner)
router.post('/admin/banner/edit', isAdminAuth, editBanner)
router.post('/admin/banner/delete', isAdminAuth, deleteBanner)
router.post('/admin/banners', isAdminAuth, indexBanners)

router.post('/admin/promotion/add', isAdminAuth, addPromotion)
router.post('/admin/promotion/edit', isAdminAuth, editPromotion)
router.post('/admin/promotion/delete', isAdminAuth, deletePromotion)
router.post('/admin/promotions', isAdminAuth, indexPromotions)

router.post('/admin/user/signup', signUp)
router.post('/admin/user/edit', isAdminAuth, editUser)
router.post('/admin/user/delete', isAdminAuth, deleteUser)
router.post('/admin/users', isAdminAuth, indexUsers)

// -------------------------- FRONT END ROUTES -------------------------- // 

// CUSTOMER AUTH ROUTES
router.post('/signup', signUp)
router.post('/login', logIn)
router.get('/logout', logOut)
router.post('/reset-password', passwordResetCustomer)

// END AUTH ROUTES

router.post('/')
router.post('/systemdata', getSystemData)
router.post('/orders/checkout', placeOrder)
router.post('/my-orders', getOrders)
router.post('/profile', getProfileData)
router.post('/update-profile', editUser)
router.post('/review/add', postReview)
router.post('/reset-password', resetPassword)
router.post('/menu-items', indexItems)
router.post('/item/:id', getSingleItem)
router.post('/get-addons', getAddons)
router.post('/get-sliders', indexSliders)
router.post('/categories', indexCategories)
router.post('/promocodes', indexPromotions)