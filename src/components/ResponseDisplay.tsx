'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExperimentData } from '@/types'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon,
  CpuChipIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface ResponseDisplayProps {
  experiment: ExperimentData
}

export default function ResponseDisplay({ experiment }: ResponseDisplayProps) {
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  const formatScore = (score: number) => Math.round(score * 100) / 100

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      
      return date.toLocaleDateString('en-US', options).replace(',', '')
    } catch (_err) {
      return 'Invalid Date'
    }
  }

  const chartData = experiment.responses.map((response, index) => ({
    name: `Response ${index + 1}`,
    coherence: formatScore(response.metrics.coherence),
    completeness: formatScore(response.metrics.completeness),
    readability: formatScore(response.metrics.readability),
    relevance: formatScore(response.metrics.relevance),
    overall: formatScore(response.metrics.overallScore)
  }))

  const bestResponse = experiment.responses.reduce((best, current) => 
    current.metrics.overallScore > best.metrics.overallScore ? current : best
  )

  const averageMetrics = {
    coherence: experiment.responses.reduce((sum, r) => sum + r.metrics.coherence, 0) / experiment.responses.length,
    completeness: experiment.responses.reduce((sum, r) => sum + r.metrics.completeness, 0) / experiment.responses.length,
    readability: experiment.responses.reduce((sum, r) => sum + r.metrics.readability, 0) / experiment.responses.length,
    relevance: experiment.responses.reduce((sum, r) => sum + r.metrics.relevance, 0) / experiment.responses.length,
    overallScore: experiment.responses.reduce((sum, r) => sum + r.metrics.overallScore, 0) / experiment.responses.length
  }

  const radarData = [
    { metric: 'Coherence', score: averageMetrics.coherence },
    { metric: 'Completeness', score: averageMetrics.completeness },
    { metric: 'Readability', score: averageMetrics.readability },
    { metric: 'Relevance', score: averageMetrics.relevance }
  ]

  const exportExperiment = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experimentId: experiment.id,
          format,
          includeMetrics: true,
          includeDetails: false
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `experiment_${experiment.id}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setShowExportDropdown(false)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experiment Results</h2>
          <p className="text-gray-600 mt-1">
            Generated {experiment.totalRuns} diverse responses for comparison
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export
          </button>
          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => exportExperiment('json')}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Export JSON
              </button>
              <button
                onClick={() => exportExperiment('csv')}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportExperiment('pdf')}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Responses</p>
              <p className="text-sm font-bold text-blue-600">{experiment.totalRuns}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Best Score</p>
              <p className="text-sm font-bold text-green-600">{formatScore(bestResponse.metrics.overallScore)}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <CpuChipIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">Average Score</p>
              <p className="text-sm font-bold text-purple-600">{formatScore(averageMetrics.overallScore)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Bar dataKey="coherence" fill="#3B82F6" />
              <Bar dataKey="completeness" fill="#10B981" />
              <Bar dataKey="readability" fill="#8B5CF6" />
              <Bar dataKey="relevance" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Quality Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 1]} />
              <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Generated Responses</h3>
        {experiment.responses.map((response, index) => (
          <div
            key={response.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">Response {index + 1}</span>
                    {response.id === bestResponse.id && (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Best Overall
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Temp: {response.parameters.temperature}</span>
                    <span>Top-P: {response.parameters.top_p}</span>
                    <span>Tokens: {response.parameters.max_tokens}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatScore(response.metrics.overallScore)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatScore(response.metrics.coherence)}</div>
                  <div className="text-sm text-gray-600">Coherence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatScore(response.metrics.completeness)}</div>
                  <div className="text-sm text-gray-600">Completeness</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatScore(response.metrics.readability)}</div>
                  <div className="text-sm text-gray-600">Readability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatScore(response.metrics.relevance)}</div>
                  <div className="text-sm text-gray-600">Relevance</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-gray-900 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {response.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}