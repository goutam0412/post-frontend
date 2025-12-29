"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Calendar,
  Plus,
  Eye,
  Edit3,
  TrendingUp,
  Clock,
  AlertCircle,
  Trash2,
  BarChart,
  Users,
} from "lucide-react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import CreateCampaignModal from "@/components/CreateCampaignModal";
import CampaignPreviewModal from "@/components/CampaignPreviewModal";
import axios from "axios";

const statusMap = {
  completed: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  active: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  draft: { icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-100" },
};

export default function CampaignsContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [previewCampaignData, setPreviewCampaignData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [campaignFilter , setCampaignsFilter] = useState({
    status: 'All'
  })
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchCampaigns();
  }, [campaignFilter, page, perPage]);

  useEffect(() => {
    if (!!campaignToEdit) {
      console.log(campaignToEdit)
      setShowCreateModal(true);
    }
  }, [campaignToEdit]);

  const fetchCampaigns = useCallback(async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      var urlString = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns?`;

      if (campaignFilter?.status && campaignFilter.status !== 'All') {
        urlString += `status=${campaignFilter.status}&`
      }

      urlString += `page=${page}&per_page=${perPage}`

      const res = await fetch(urlString, {
        method: 'GET',
        headers: {
          token: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const campaignsData = data?.campaigns || [];
      setCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
      setTotalPages(data?.pagination?.total_pages || 1);
      console.log("Fetched campaigns:", campaignsData);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setCampaigns([]);
      setFilteredCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [token, campaignFilter, page, perPage])

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCampaigns(campaigns);
    } else {
      const lower = query.toLowerCase();
      setFilteredCampaigns(
        campaigns.filter(
          (camp) =>
            camp.name?.toLowerCase().includes(lower) ||
            camp.postTitle?.toLowerCase().includes(lower) ||
            camp.audience?.toLowerCase().includes(lower) ||
            camp.status?.toLowerCase().includes(lower)
        )
      );
    }
  };

  const handleSaveCampaign = async (newCampaignData) => {
    const newCampaign = {
      name: newCampaignData.campaignName,
      postTitle: newCampaignData.selectedPost?.title || "",
      budget: newCampaignData.budget,
      schedule: newCampaignData.schedule,
      audience: `${newCampaignData.location}, ${newCampaignData.age}, ${newCampaignData.interests}`,
      status: newCampaignData.status || "draft",
      platform: "Facebook/Instagram",
      createdAt: new Date().toLocaleDateString(),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`,
        {
          campaign: {
            business_profile_id: newCampaignData.business_profile_id, 
            title: newCampaignData.campaignName,
            budget: newCampaignData.budget,
            schedule: newCampaignData.schedule,
            status: newCampaignData.status,
            platform: "facebook",
            // audience: {
            //   location: newCampaignData.location,
            //   age: newCampaignData.age,
            //   interests: newCampaignData.interests,
            // },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchCampaigns()
    } catch (error) {
      console.error(
        "Create campaign error:",
        error.response?.data || error.message
      );
    } finally {
      setShowCreateModal(false);
    }

  };

  const handleUpdateCampaign = (updatedData) => {
    const updatedCampaigns = campaigns.map((camp) =>
      camp.id === updatedData.id
        ? { ...camp, ...updatedData, status: updatedData.status || camp.status }
        : camp
    );
    setCampaigns(updatedCampaigns);
    setFilteredCampaigns(updatedCampaigns);
    setShowCreateModal(false);
  };

  const deleteCampaign = (id) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      const updatedCampaigns = campaigns.filter((camp) => camp.id !== id);
      setCampaigns(updatedCampaigns);
      setFilteredCampaigns(updatedCampaigns);
    }
  };

  const editCampaign = (id) => {
    const campaign = campaigns.find((c) => c.id === id)
    if (campaign) {
      setCampaignToEdit(campaign)
      setShowCreateModal(true)
    }
  }

  const previewCampaign = (campaign) => {
    setPreviewCampaignData(campaign);
    setShowCampaignModal(true);
  };

  return (
    <div className="flex h-screen" style={{ background: "#f2f0fe" }}>
      <SideBar />
      <div className='flex-1 overflow-auto'>
        <Header title='My Campaigns' onSearch={handleSearch} />

        <div className='w-64 pl-8'>
          <label
            className='block text-sm font-medium text-gray-700 mb-1'
            style={{ fontWeight: 900 }}
          >
            Filter By Status
          </label>
          <select
            value={campaignFilter.status}
            onChange={(e) => {
              setCampaignsFilter((prev) => ({
                ...prev,
                status: e.target.value,
              }))
              setPage(1)
            }}
            className='w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 shadow-md hover:shadow-lg transition-all'
          >
            <option value='All'>ALL</option>
            <option value='active'>Active</option>
            <option value='draft'>Draft</option>
            <option value='completed'>Completed</option>
          </select>
        </div>

        <div className="p-8">
          <div className="bg-white shadow-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  CAMPAIGN MANAGEMENT
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Monitor and manage all your paid ad campaigns.
                </p>
              </div>
              <button
                onClick={() => {
                  setCampaignToEdit(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-white font-semibold hover:shadow-xl"
                style={{ backgroundColor: "#bbb5ed", color: "#000" }}
              >
                <Plus className="w-5 h-5" /> Create Campaign
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center">Loading campaigns...</div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Campaigns Running
                </h3>
                <p className="text-gray-600 mb-6">
                  Launch your first ad campaign to start generating results.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg"
                  style={{ backgroundColor: "#7c3aed" }}
                >
                  Create Campaign
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign / Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget / Schedule
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Audience
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredCampaigns.map((camp) => {
                      const campStatus =
                        statusMap[camp.status] || statusMap["draft"];
                      const StatusIcon = campStatus.icon;
                      return (
                        <tr
                          key={camp.id}
                          className="hover:bg-purple-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap max-w-sm">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {camp.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              Post: {camp.postTitle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-800 flex items-center gap-1">
                              <BarChart className="w-4 h-4 text-purple-600" /> $
                              {camp.budget}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />{" "}
                              {camp.schedule
                                ? new Date(camp.schedule).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                            <span className="text-sm text-gray-700 flex items-center gap-1">
                              <Users className="w-4 h-4 text-teal-600" />{" "}
                              {camp.audience}
                            </span>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${campStatus.bg} ${campStatus.color}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1.5" />
                              {camp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => previewCampaign(camp)}
                                className="p-2 text-gray-500 hover:text-gray-800"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => editCampaign(camp.id)}
                                className="p-2 text-gray-500 hover:text-gray-800"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteCampaign(camp.id)}
                                className="p-2 text-gray-500 hover:text-gray-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          { (
            <div className='p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50'>
              {/* <div className='text-sm text-gray-600'>
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredCampaigns.length)} of{' '}
                {filteredCampaigns.length} entries
              </div> */}
              <div className='flex gap-2'>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>

                <div className='flex items-center px-4 text-sm font-semibold text-purple-700'>
                  Page {page} of {totalPages || 1}
                </div>

                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage((prev) => prev + 1)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    page === totalPages || totalPages === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveCampaign}
          campaignData={campaignToEdit}
          showModal
        />
      )}

      {showCampaignModal && previewCampaignData && (
        <CampaignPreviewModal
          onClose={() => setShowCampaignModal(false)}
          campaign={previewCampaignData}
        />
      )}
    </div>
  );
}
