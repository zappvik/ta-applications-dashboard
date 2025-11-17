import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm'



export default function SettingsPage() {

  return (

    <div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">

        Settings

      </h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">

        <p className="text-gray-600 dark:text-gray-300 mb-4">Manage your account preferences here.</p>

        <ChangePasswordForm />

      </div>

    </div>

  )

}

