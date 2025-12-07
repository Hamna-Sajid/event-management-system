"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";

// Define the option interface for Select component


interface FormData {
  name: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  registrationLink: string;
  tags: string;
  subEvents: SubEventForm[];
}

interface SubEventForm {
  name: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  registrationLink: string;
}

const eventTypes = [
  "Workshop",
  "Seminar",
  "Conference",
  "Competition",
  "Social",
  "Academic",
  "Cultural",
  "Sports",
  "Other"
];

interface EventFormProps {
  onSubmit: (data: FormData) => void;
}

export default function EventForm({ onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    eventType: "",
    startDate: "",
    endDate: "",
    location: "",
    registrationLink: "",
    tags: "",
    subEvents: []
  });

  const [isAddingSubEvent, setIsAddingSubEvent] = useState(false);
  const [subEventForm, setSubEventForm] = useState<SubEventForm>({
    name: "",
    description: "",
    eventType: "",
    startDate: "",
    endDate: "",
    location: "",
    registrationLink: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubEventSelectChange = (name: string, value: string) => {
    setSubEventForm(prev => ({ ...prev, [name]: value }));
  };

  const addSubEvent = () => {
    // Validate sub-event data
    if (!subEventForm.name || !subEventForm.startDate) {
      showToast("Please fill in all required fields for the sub-event", "error");
      return;
    }

    setFormData(prev => ({
      ...prev,
      subEvents: [...prev.subEvents, { ...subEventForm }]
    }));

    setSubEventForm({
      name: "",
      description: "",
      eventType: "",
      startDate: "",
      endDate: "",
      location: "",
      registrationLink: ""
    });
    setIsAddingSubEvent(false);
  };

  const removeSubEvent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subEvents: prev.subEvents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate main event data
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-6">
        <div className="bg-[rgba(255,255,255,0.03)] p-6 rounded-xl border border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Event Title *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Event Type *</label>
                <Select
                  value={formData.eventType}
                  onChange={(value) => handleSelectChange("eventType", value)}
                  options={eventTypes.map(type => ({ value: type.toLowerCase().replace(/\s+/g, '_'), label: type }))}
                  placeholder="Select event type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Start Date & Time *</label>
                <Input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white focus:ring-[#d02243] focus:border-[#d02243]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">End Date & Time *</label>
                <Input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white focus:ring-[#d02243] focus:border-[#d02243]"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Venue *</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter venue (building, room, address)"
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Registration Link</label>
                <Input
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/register"
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Tags</label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Comma separated tags (e.g. workshop, tech, seminar)"
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-white mb-2">Description *</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed event description"
              rows={6}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
              required
            />
          </div>
        </div>
      </div>

      {/* Sub-events Section */}
      <div className="space-y-6">
        <div className="bg-[rgba(255,255,255,0.03)] p-6 rounded-xl border border-[rgba(255,255,255,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Sub-Events</h3>
            {formData.subEvents.length > 0 && (
              <span className="text-sm text-[rgba(255,255,255,0.7)]">
                {formData.subEvents.length} sub-event{formData.subEvents.length !== 1 ? 's' : ''} added
              </span>
            )}
          </div>

          {formData.subEvents.length > 0 && (
            <div className="mb-6 space-y-4">
              {formData.subEvents.map((subEvent, index) => (
                <div key={index} className="p-4 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.1)]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{subEvent.name}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeSubEvent(index)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="text-sm text-[rgba(255,255,255,0.7)] grid grid-cols-2 gap-2">
                    <p><strong>Type:</strong> {subEvent.eventType || "Not specified"}</p>
                    <p><strong>Time:</strong> {subEvent.startDate}</p>
                    <p><strong>Location:</strong> {subEvent.location || "Not specified"}</p>
                    <p><strong>Registration:</strong> {subEvent.registrationLink ? "Yes" : "No"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAddingSubEvent ? (
            <div className="p-4 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.1)]">
              <h4 className="font-medium text-white mb-4">Add Sub-Event</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Sub-Event Title *</label>
                    <Input
                      name="name"
                      value={subEventForm.name}
                      onChange={handleSubEventInputChange}
                      placeholder="Enter sub-event title"
                      className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Type</label>
                    <Select
                      value={subEventForm.eventType}
                      onChange={(value) => handleSubEventSelectChange("eventType", value)}
                      options={eventTypes.map(type => ({ value: type.toLowerCase().replace(/\s+/g, '_'), label: type }))}
                      placeholder="Select event type"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Date & Time *</label>
                    <Input
                      type="datetime-local"
                      name="startDate"
                      value={subEventForm.startDate}
                      onChange={handleSubEventInputChange}
                      className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white focus:ring-[#d02243] focus:border-[#d02243]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={subEventForm.description}
                    onChange={handleSubEventInputChange}
                    placeholder="Enter sub-event description"
                    rows={3}
                    className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white mb-2">Venue</label>
                    <Input
                      name="location"
                      value={subEventForm.location}
                      onChange={handleSubEventInputChange}
                      placeholder="Enter venue"
                      className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white mb-2">Registration Link</label>
                    <Input
                      name="registrationLink"
                      value={subEventForm.registrationLink}
                      onChange={handleSubEventInputChange}
                      placeholder="https://example.com/register"
                      className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.5)] focus:ring-[#d02243] focus:border-[#d02243]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  onClick={addSubEvent}
                  className="bg-[#d02243] hover:bg-[#b01c39]"
                >
                  Add Sub-Event
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingSubEvent(false)}
                  className="border-[rgba(255,255,255,0.3)] text-white hover:bg-[rgba(255,255,255,0.1)]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingSubEvent(true)}
              className="border-[rgba(255,255,255,0.3)] text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              + Add Sub-Event
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#d02243] hover:bg-[#b01c39] text-white px-8 py-3 text-lg"
        >
          Create Event
        </Button>
      </div>
    </form>
  );
}