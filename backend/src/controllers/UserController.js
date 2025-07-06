const express = require('express');
const User = require('../models/User.model');


// Get the user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const {
            businessName,
            businessType,
            ownerName,
            phone,
            address,
            city,
            state,
            pincode,
            gstNumber,
            businessDescription } = req.body;

        const updateData = {
            businessName,
            businessType,
            ownerName,
            phone,
            address: {
                street: address,
                city,
                state,
                pincode
            },
            gstNumber,
            businessDescription
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }).select('-password');

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// update user prfile by id
exports.updateUserProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');      
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'User profile updated successfully',
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user profile'
        });
    }
};










