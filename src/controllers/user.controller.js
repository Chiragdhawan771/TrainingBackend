import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (err) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "OK kahe ka ok "
    // })

    // get user details from frontend refer model 
    // validation - notempty , email is in correct format
    // check if usr already exist :username ,email
    // check from images,check for avatar
    // update it on cloudinary,avatar
    // create user object - create object in user
    // remove refresh toekn and password field from response
    // check for user creation 
    // rewturn res

    const { fullname, email, username, password } = req.body
    console.log(email, req.files)
    // if (fullname === "") throw new ApiError(400, "full name error")
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existedUser) throw new ApiError(409, "user with email or user exists")

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalpath = req.files.coverImage[0]?.path
    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required")
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({ fullname, avatar: avatar.url, coverImage: coverImage?.url || "", email, username: username.toLowerCase(), password })
    const createduser = await User.findById(user._id).select("-password -refreshToken");
    if (!createduser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(200, createduser, "User registered successfully "))

})
const loginUser = asyncHandler(async (req, res) => {
    // req.body=>data
    // username||email
    // find user
    // getpassword and  match it to find user
    // generate access and refresh token
    const { username, email, password } = req.body;
    console.log(username)
    if (!(username || email)) throw new ApiError(400, "Invalid username or password")
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (!user) throw new ApiError(404, "User not exist")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    // console.log(accessToken, refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    console.log("userloggedIn", loggedInUser)
    const options = {
        httpOnly: true,
        secure: true        //By default cookiees are mutable from front end side to make it Immutable from front side 
        // so that it just can be accessed form server side secure is said to true

    }

    return res.status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "user logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined }
    }, { new: true })

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out SuccessFully"))

})
export { registerUser, loginUser, logoutUser }