import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm'
import SettingsPreferencesCard from '@/components/dashboard/SettingsPreferencesCard'
import FeatureRequestButton from '@/components/dashboard/FeatureRequestButton'
import SettingsTipsCard from '@/components/dashboard/SettingsTipsCard'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6 auto-rows-fr">
            <SettingsPreferencesCard />
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col">
              <ChangePasswordForm />
            </div>
          </div>
          
          <FeatureRequestButton />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <SettingsTipsCard />
        </div>
      </div>
    </div>
  )
}
