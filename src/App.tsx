import { Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { CertificationPage } from '@/pages/CertificationPage'
import { ModulePage } from '@/pages/ModulePage'
import { LessonPage } from '@/pages/LessonPage'
import { QuizIntroPage } from '@/pages/QuizIntroPage'
import { QuizAttemptPage } from '@/pages/QuizAttemptPage'
import { QuizResultsPage } from '@/pages/QuizResultsPage'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  const location = useLocation()
  // The lesson player is full-screen and supplies its own chrome, so it is
  // rendered outside the standard Layout.
  const isLesson = /\/lesson\//.test(location.pathname)

  if (isLesson) {
    return (
      <Routes>
        <Route
          path="/cert/:certId/module/:moduleId/lesson/:lessonId"
          element={<LessonPage />}
        />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cert/:certId" element={<CertificationPage />} />
        <Route path="/cert/:certId/module/:moduleId" element={<ModulePage />} />
        <Route path="/cert/:certId/module/:moduleId/quiz" element={<QuizIntroPage />} />
        <Route path="/cert/:certId/module/:moduleId/quiz/attempt" element={<QuizAttemptPage />} />
        <Route path="/cert/:certId/module/:moduleId/quiz/results/:attemptId" element={<QuizResultsPage />} />
        <Route path="/cert/:certId/quiz/struggles" element={<QuizIntroPage />} />
        <Route path="/cert/:certId/quiz/struggles/attempt" element={<QuizAttemptPage />} />
        <Route path="/cert/:certId/quiz/struggles/results/:attemptId" element={<QuizResultsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
