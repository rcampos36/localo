"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Shield, Plus, X, Save, Image as ImageIcon,
  MapPin, FileText, Activity, Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import departamentosData from "@/data/el-salvador-departamentos.json";

interface ActivityItem {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  bestTime?: string;
  location?: string;
  coordinates?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [heroImage, setHeroImage] = useState<string>("");
  const [cardImage, setCardImage] = useState<string>("");
  const [activities, setActivities] = useState<Record<string, ActivityItem[]>>({});
  const [currentActivity, setCurrentActivity] = useState<ActivityItem>({
    name: "",
    description: "",
    difficulty: "Easy",
    duration: "",
    category: "",
    bestTime: "",
    location: "",
    coordinates: ""
  });
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);
  const [editingActivityCategory, setEditingActivityCategory] = useState<string>("");
  const [activityCategory, setActivityCategory] = useState<string>("adventure");
  const [saveMessage, setSaveMessage] = useState<string>("");

  const activityCategories = [
    { value: "adventure", label: "Adventure" },
    { value: "culture", label: "Culture" },
    { value: "food", label: "Food" },
    { value: "nature", label: "Nature" },
    { value: "beaches", label: "Beaches" },
    { value: "history", label: "History" },
  ];

  const difficultyLevels = ["Easy", "Medium", "Hard", "Beginner", "Beginner to Advanced"];

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (selectedDepartamento) {
      loadDepartamentoData(selectedDepartamento);
    }
  }, [selectedDepartamento]);

  const loadDepartamentoData = (departamentoId: string) => {
    const departamento = departamentosData.features.find(
      (f) => f.properties.id === departamentoId
    );

    if (departamento) {
      const props = departamento.properties as any;
      setDescription(props.description || "");
      setHeroImage(props.heroImage || "");
      setCardImage(props.cardImage || "");
      setActivities(props.activities || {});
    }
  };

  const handleAddActivity = () => {
    if (!currentActivity.name || !currentActivity.description) {
      alert("Please fill in activity name and description");
      return;
    }

    const newActivities = { ...activities };
    if (!newActivities[activityCategory]) {
      newActivities[activityCategory] = [];
    }

    if (editingActivityIndex !== null && editingActivityCategory) {
      // Update existing activity
      newActivities[editingActivityCategory][editingActivityIndex] = currentActivity;
      setEditingActivityIndex(null);
      setEditingActivityCategory("");
    } else {
      // Add new activity
      newActivities[activityCategory].push(currentActivity);
    }

    setActivities(newActivities);
    setCurrentActivity({
      name: "",
      description: "",
      difficulty: "Easy",
      duration: "",
      category: "",
      bestTime: "",
      location: "",
      coordinates: ""
    });
  };

  const handleEditActivity = (category: string, index: number) => {
    const activity = activities[category][index];
    setCurrentActivity(activity);
    setEditingActivityIndex(index);
    setEditingActivityCategory(category);
    setActivityCategory(category);
  };

  const handleDeleteActivity = (category: string, index: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      const newActivities = { ...activities };
      newActivities[category] = newActivities[category].filter((_, i) => i !== index);
      setActivities(newActivities);
    }
  };

  const handleSave = () => {
    if (!selectedDepartamento) {
      alert("Please select a departamento");
      return;
    }

    // Save to localStorage (in production, this would be an API call)
    const savedData = localStorage.getItem("adminDepartamentosData") || "{}";
    const allData = JSON.parse(savedData);
    
    allData[selectedDepartamento] = {
      description,
      heroImage,
      cardImage,
      activities,
    };

    localStorage.setItem("adminDepartamentosData", JSON.stringify(allData));
    setSaveMessage("Data saved successfully! (Note: This saves to localStorage. For production, implement API routes to update the JSON file.)");
    
    setTimeout(() => setSaveMessage(""), 5000);
  };

  const getDepartamentoName = (id: string) => {
    const dep = departamentosData.features.find(f => f.properties.id === id);
    return dep ? (dep.properties as any).name : id;
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 group">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage departamentos, activities, images, and descriptions</p>
        </div>

        {saveMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {saveMessage}
          </div>
        )}

        {/* Departamento Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedDepartamento}
              onChange={(e) => setSelectedDepartamento(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a departamento --</option>
              {departamentosData.features.map((feature) => (
                <option key={feature.properties.id} value={feature.properties.id}>
                  {(feature.properties as any).name} ({feature.properties.code})
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {selectedDepartamento && (
          <>
            {/* Description and Images */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter departamento description..."
                    rows={6}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Hero Image URL
                    </label>
                    <Input
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Card Image URL
                    </label>
                    <Input
                      value={cardImage}
                      onChange={(e) => setCardImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities Management */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activities
                </CardTitle>
                <CardDescription>
                  Add, edit, or remove activities for {getDepartamentoName(selectedDepartamento)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add/Edit Activity Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-4">
                    {editingActivityIndex !== null ? "Edit Activity" : "Add New Activity"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Category
                      </label>
                      <select
                        value={activityCategory}
                        onChange={(e) => setActivityCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {activityCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Activity Name *
                      </label>
                      <Input
                        value={currentActivity.name}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })}
                        placeholder="e.g., Hiking El Boquerón"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Description *
                      </label>
                      <Textarea
                        value={currentActivity.description}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                        placeholder="Describe the activity..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Difficulty
                      </label>
                      <select
                        value={currentActivity.difficulty}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, difficulty: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Duration
                      </label>
                      <Input
                        value={currentActivity.duration}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, duration: e.target.value })}
                        placeholder="e.g., 2-3 hours"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Category (Activity Type)
                      </label>
                      <Input
                        value={currentActivity.category}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, category: e.target.value })}
                        placeholder="e.g., Hiking, Museum, Food Tour"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Best Time
                      </label>
                      <Input
                        value={currentActivity.bestTime || ""}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, bestTime: e.target.value })}
                        placeholder="e.g., Early morning (6-9 AM)"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Location
                      </label>
                      <Input
                        value={currentActivity.location || ""}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, location: e.target.value })}
                        placeholder="e.g., El Boquerón National Park"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Coordinates
                      </label>
                      <Input
                        value={currentActivity.coordinates || ""}
                        onChange={(e) => setCurrentActivity({ ...currentActivity, coordinates: e.target.value })}
                        placeholder="e.g., 13.7231° N, 89.2906° W"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddActivity}>
                      <Plus className="h-4 w-4 mr-2" />
                      {editingActivityIndex !== null ? "Update Activity" : "Add Activity"}
                    </Button>
                    {editingActivityIndex !== null && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentActivity({
                            name: "",
                            description: "",
                            difficulty: "Easy",
                            duration: "",
                            category: "",
                            bestTime: "",
                            location: "",
                            coordinates: ""
                          });
                          setEditingActivityIndex(null);
                          setEditingActivityCategory("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Existing Activities */}
                <div className="space-y-6">
                  {activityCategories.map((category) => {
                    const categoryActivities = activities[category.value] || [];
                    if (categoryActivities.length === 0) return null;

                    return (
                      <div key={category.value}>
                        <h4 className="font-semibold text-lg mb-3 capitalize">
                          {category.label} ({categoryActivities.length})
                        </h4>
                        <div className="space-y-3">
                          {categoryActivities.map((activity, index) => (
                            <Card key={index} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h5 className="font-semibold text-lg">{activity.name}</h5>
                                      <Badge variant="secondary">{activity.difficulty}</Badge>
                                    </div>
                                    <p className="text-gray-600 mb-2">{activity.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                      {activity.duration && (
                                        <span>Duration: {activity.duration}</span>
                                      )}
                                      {activity.category && (
                                        <span>Type: {activity.category}</span>
                                      )}
                                      {activity.location && (
                                        <span>Location: {activity.location}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditActivity(category.value, index)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteActivity(category.value, index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleSave} size="lg">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

