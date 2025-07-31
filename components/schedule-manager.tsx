"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, Download, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ScheduleItem {
  id: string
  title_id: string
  language: string
  platform: string
  scheduled_time: string
  status: string
  recipe: {
    title_ko: string
    series: {
      name: string
      episode_number: number
    }
  }
}

interface ScheduleManagerProps {
  onScheduleUpdated: () => void
}

export default function ScheduleManager({ onScheduleUpdated }: ScheduleManagerProps) {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [availableRecipes, setAvailableRecipes] = useState<any[]>([])
  const [newSchedule, setNewSchedule] = useState({
    title_id: "",
    language: "",
    platform: "",
    scheduled_time: "",
  })

  useEffect(() => {
    loadScheduleItems()
    loadAvailableRecipes()
  }, [])

  const loadScheduleItems = async () => {
    try {
      const { data, error } = await supabase
        .from("content_schedule")
        .select(`
          id,
          title_id,
          language,
          platform,
          scheduled_time,
          status,
          recipe:recipe_titles(
            title_ko,
            series:recipe_series(name, episode_number)
          )
        `)
        .order("scheduled_time", { ascending: true })

      if (error) throw error
      setScheduleItems(data || [])
    } catch (error) {
      console.error("Error loading schedule:", error)
    }
  }

  const loadAvailableRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_titles")
        .select(`
          id,
          title_ko,
          series:recipe_series(name, episode_number),
          content:recipe_content(language),
          cards:recipe_cards(language, image_url)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAvailableRecipes(data || [])
    } catch (error) {
      console.error("Error loading recipes:", error)
    }
  }

  const addScheduleItem = async () => {
    if (!newSchedule.title_id || !newSchedule.language || !newSchedule.platform || !newSchedule.scheduled_time) {
      return
    }

    try {
      const { error } = await supabase.from("content_schedule").insert([newSchedule])

      if (error) throw error

      setNewSchedule({
        title_id: "",
        language: "",
        platform: "",
        scheduled_time: "",
      })

      await loadScheduleItems()
      onScheduleUpdated()
    } catch (error) {
      console.error("Error adding schedule item:", error)
    }
  }

  const deleteScheduleItem = async (id: string) => {
    try {
      const { error } = await supabase.from("content_schedule").delete().eq("id", id)

      if (error) throw error

      await loadScheduleItems()
      onScheduleUpdated()
    } catch (error) {
      console.error("Error deleting schedule item:", error)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("content_schedule")
        .update({
          status,
          posted_at: status === "posted" ? new Date().toISOString() : null,
        })
        .eq("id", id)

      if (error) throw error

      await loadScheduleItems()
      onScheduleUpdated()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const exportToCSV = () => {
    const headers = ["Recipe Title", "Series", "Language", "Platform", "Scheduled Time", "Status"]
    const csvContent = [
      headers.join(","),
      ...scheduleItems.map((item) =>
        [
          `"${item.recipe.title_ko}"`,
          `"Ep.${item.recipe.series.episode_number} - ${item.recipe.series.name}"`,
          item.language,
          item.platform,
          new Date(item.scheduled_time).toLocaleString(),
          item.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "makgeolli-content-schedule.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const languages = [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  const platforms = ["threads", "instagram", "facebook", "twitter"]
  const statuses = ["scheduled", "posted", "failed", "cancelled"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "posted":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Schedule Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <Plus className="w-5 h-5 mr-2" />
            Schedule New Post
          </CardTitle>
          <CardDescription>Schedule content for posting on social media platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Recipe</Label>
              <Select
                value={newSchedule.title_id}
                onValueChange={(value) => setNewSchedule((prev) => ({ ...prev, title_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipe" />
                </SelectTrigger>
                <SelectContent>
                  {availableRecipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.title_ko}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={newSchedule.language}
                onValueChange={(value) => setNewSchedule((prev) => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={newSchedule.platform}
                onValueChange={(value) => setNewSchedule((prev) => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scheduled Time</Label>
              <Input
                type="datetime-local"
                value={newSchedule.scheduled_time}
                onChange={(e) => setNewSchedule((prev) => ({ ...prev, scheduled_time: e.target.value }))}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addScheduleItem} className="w-full bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-amber-800">
                <Calendar className="w-5 h-5 mr-2" />
                Content Schedule
              </CardTitle>
              <CardDescription>Manage your scheduled social media posts</CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe</TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.recipe.title_ko}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        Ep.{item.recipe.series.episode_number} - {item.recipe.series.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {languages.find((l) => l.code === item.language)?.flag} {item.language.toUpperCase()}
                    </TableCell>
                    <TableCell className="capitalize">{item.platform}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(item.scheduled_time).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={item.status} onValueChange={(value) => updateStatus(item.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              <Badge className={getStatusColor(status)}>{status}</Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteScheduleItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
