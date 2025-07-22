const Vendor = require('../Models/Vendor');

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({ 
            role: 'Vendor',
            isApproved: false  // Only get pending vendors
        }).sort({ createdAt: -1 }); // latest first
        
        res.status(200).json({ 
            result: "Done",
            vendors: vendors
        });
    } catch (err) {
        console.error("Error fetching vendors:", err);
        res.status(500).json({ 
            result: "Fail", 
            message: "Server error" 
        });
    }
};

const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { 
                isApproved: true,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({
                result: "Fail",
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            result: "Done",
            message: "Vendor approved successfully",
            vendor: {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                isApproved: vendor.isApproved
            }
        });
    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({
            result: "Fail",
            message: "Failed to approve vendor"
        });
    }
};

const getPendingVendors = async (req, res) => {
    try {
        const pendingVendors = await Vendor.find({ 
            role: 'Vendor',
            isApproved: false 
        }).select('name email phone company shopName createdAt')
          .sort({ createdAt: -1 });

        res.status(200).json({
            result: "Done",
            vendors: pendingVendors
        });
    } catch (error) {
        console.error("Error fetching pending vendors:", error);
        res.status(500).json({
            result: "Fail",
            message: 'Error fetching pending vendors'
        });
    }
};

const getVendorStatus = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                isApproved: vendor.isApproved,
                name: vendor.name,
                email: vendor.email,
                company: vendor.company,
                shopName: vendor.shopName,
                createdAt: vendor.createdAt,
                message: vendor.isApproved ? 
                    'Your account is approved. You can access the vendor dashboard.' :
                    'Your account is pending approval. Please contact admin at support@industryguru.com'
            }
        });
    } catch (error) {
        console.error("Error fetching vendor status:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vendor status',
            error: error.message
        });
    }
};

module.exports = [ getAllVendors, approveVendor, getPendingVendors, getVendorStatus ];
