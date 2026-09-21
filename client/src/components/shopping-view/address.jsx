import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice";
import AddressCard from "./addressCard";
import { toast } from "../ui/toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  postalCode: "",
  note: "",
};

function Address({ selectedAddressId, onSelectAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const dispatch = useDispatch();
  async function handleMangeAddress(event) {
    event.preventDefault();
   
    if(addressList.length >= 3 && currentEditedId ===null){ 
        toast.add({
            title:"You can only add just 3 addresses",
            variant:"destructive",
            duration:2000
        })
        setFormData(initialAddressFormData);
        return;
    }
 if (currentEditedId) {  
    
   const response = await dispatch(editAddress({
    userId:user?.userId, addressId:currentEditedId, formData,
 }))
      if (response.payload.success) {
      dispatch(fetchAllAddress(user?.userId));
      setFormData(initialAddressFormData);
      setCurrentEditedId(null)
    }
    toast.add({
        title:"Address Edited successfully",
        duration:2000
    })
    return
}
    const response = await dispatch(
      addNewAddress({
        ...formData,
        userId: user?.userId,
      }),
    );
    if (response.payload.success) {
      dispatch(fetchAllAddress(user?.userId));
      setFormData(initialAddressFormData);
    }

    console.log(response);
  }
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }
  useEffect(() => {
    dispatch(fetchAllAddress(user?.userId));
  }, [dispatch, user.userId]);

  console.log(addressList);
  async function handleDeleteAddress(getCurrentAddress) {
    console.log(getCurrentAddress);
    const response = await dispatch(
      deleteAddress({
        userId: user?.userId,
        addressId: getCurrentAddress._id,
      }),
    );

    if (response?.payload.success) {
      dispatch(fetchAllAddress(user?.userId));
      toast.add({
        title: "Address deleted successfully",
        duration: 2000,
      });
    }
  }
  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      postalCode: getCurrentAddress?.postalCode,
      note: getCurrentAddress?.note,
    });
  }
  return (
    <Card>
      <div className="mb-5 grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 md:grid-cols-3">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem, index) => (
              <AddressCard
                key={index}
                addressInfo={singleAddressItem}
                isSelected={selectedAddressId === singleAddressItem._id}
                onSelect={() => onSelectAddress?.(singleAddressItem._id)}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>{currentEditedId ?"Edit Address": "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={ currentEditedId ? "Edit":"Add"}
          onSubmit={handleMangeAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
