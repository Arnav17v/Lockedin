"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import VideoModal from "./VideoModal";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4A90E2] to-[#50E3C2] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Track your study habits with StudyLens
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              StudyLens helps you understand and improve your study performance.
              Analyze your focus, drowsiness, and attention span to optimize
              your study sessions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 dark:bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500"
              >
                Get started
              </Link>
              <VideoModal />
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
              Study smarter
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to improve your study habits
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              StudyLens combines desktop monitoring with web analytics to give
              you powerful insights into your study performance.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-700">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Track study time
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Automatically track how long you spend studying and how that
                  time is distributed between focused and wasted time.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-700">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                      />
                    </svg>
                  </div>
                  Improve focus
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  See your attention span trends and identify when your focus is
                  strongest. Optimize your study schedule based on real data.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-700">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  Privacy-focused
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  No video or images ever leave your computer. The desktop app
                  processes everything locally and only sends anonymous
                  statistics.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-700">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                      />
                    </svg>
                  </div>
                  Detailed analytics
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Visualize your study data with powerful charts and tables.
                  Track your progress and identify areas for improvement.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Download section */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
              Download
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Get the StudyLens Desktop App
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Download our desktop application to start tracking your study
              habits and improving your productivity.
            </p>
            <div className="mt-10 flex justify-center">
              <a
                href="https://drive.google.com/drive/folders/1nmpELV_ex-xsCchNIe-A6Q_BPBjxntDY?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 dark:bg-blue-700 px-5 py-3 text-md font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500"
              >
                Download App
              </a>
            </div>
          </div>

          {/* System Requirements */}
          <div className="mx-auto mt-16 max-w-2xl lg:mt-20">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                System Requirements
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Operating System
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    macOS: macOS 11 (Big Sur) or newer (Supports both Intel and
                    Apple Silicon Macs)
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    (Note: Older macOS versions might work but are not
                    officially tested.)
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Hardware
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>
                      Processor: Apple Silicon (M1, M2, M3 Macs) or Intel Core
                      i7-10th gen or above.
                    </li>
                    <li>
                      RAM: Minimum 4 GB RAM (8 GB or more recommended for
                      smoother performance, especially alongside other
                      applications).
                    </li>
                    <li>
                      Webcam: A functional internal or external webcam is
                      required for analysis.
                    </li>
                    <li>
                      Disk Space: Approx. 2GB free disk space (for the
                      application itself and downloaded AI models - exact size
                      may vary).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#4A90E2] to-[#50E3C2] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>
    </div>
  );
}
