import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, updateProfile } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { clearUpdateProfile } from '../../slices/authSlice';

function UpdateProfile() {

    const { error, user, isUpdated } = useSelector(state => state.authState);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
    const dispatch = useDispatch();

    const onChangeAvatar = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setAvatarPreview(reader.result); // preview base64 image
            setAvatar(file); // store file
        };

        if (file) {
            reader.readAsDataURL(file); // triggers onloadend
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (!name || !email) {
            toast.error("Please enter name and email");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('avatar', avatar);

        dispatch(updateProfile(formData));
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
        if (isUpdated) {
            toast('Profile Updated Successfully', {
                type: 'success',
                onOpen:()=> dispatch(clearUpdateProfile())
            });
            return;
        }

        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearAuthError()) }
            });
        }
    }, [user, isUpdated, error, dispatch]);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                    <h1 className="mt-2 mb-5">Update Profile</h1>

                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="avatar_upload">Avatar</label>
                        <div className="d-flex align-items-center">
                            <div>
                                <figure className="avatar mr-3 item-rtl">
                                    <img
                                        src={avatarPreview}
                                        className="rounded-circle"
                                        alt="Avatar Preview"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                </figure>
                            </div>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={onChangeAvatar}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                        Update
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfile;
