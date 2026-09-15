const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../../errors");
const AddressModel = require("../../model/Address.model");

async function addAddress(req, res) {
    const { userId,
        address,
        city,
        postalCode,
        phone,
        note } = req.body;
    if (!userId ||
        !address ||
        !city ||
        !postalCode ||
        !phone ||
        !note) {
        throw new BadRequestError("Invalid data provided");
    }


    const newlyCreatedAddress = await AddressModel.create({
        userId,
        address,
        city,
        postalCode,
        phone,
        note
    });
    res.status(StatusCodes.CREATED).json({
        success: true,
        data: newlyCreatedAddress
    })
}
async function fetchAllAddress(req, res) {
    const { userId } = req.params;
    if (!userId) {
        throw new BadRequestError("User id is required")
    }
    const addressList = await AddressModel.find({ userId });

    res.status(StatusCodes.OK).json({
        success: true,
        data: addressList,
    })

}
async function editAddress(req, res) {
    const { userId, addressId } = req.params
    if (!userId || !addressId) {
        throw new BadRequestError("Invalid credentials");
    }
    const address = await AddressModel.findOneAndUpdate({
        _id: addressId, userId
    }, req.body, {
        new: true,
        runValidators: true
    });
    if(!address){
        throw new NotFoundError("Address not found");
    }

 res.status(StatusCodes.OK).json({
        success: true,
        data: address,
    })


}
async function deleteAddress(req, res) {
    const { userId, addressId } = req.params
    if (!userId || !addressId) {
        throw new BadRequestError("Invalid credentials");
    }
    const address = await AddressModel.findOneAndDelete({_id:addressId,userId});
   if(!address){
        throw new NotFoundError("Address not found");
    }

 res.status(StatusCodes.OK).json({
        success: true,
        message :"Address deleted successfully",
    })



}

module.exports = {
    addAddress,
    deleteAddress,
    editAddress,
    fetchAllAddress
}