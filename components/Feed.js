import { MOODS } from "../utils/constants"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Feed({entries}) {
  const getMood = (currMood) => {
    const mood = MOODS[Number(currMood._hex)]
    return (
      <div
          className={classNames(
            mood.bgColor,
            'w-8 h-8 rounded-full flex items-center justify-center'
          )}
        >
          <mood.icon
            className={classNames(mood.iconColor, 'flex-shrink-0 h-5 w-5')}
            aria-hidden="true"
          />
        </div>
    )
  }

    return (
      <div>
        {entries.length ?
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg text-center font-medium text-gray-900">Past Entries</h3>
        </div>
        : <></>}

        <ul role="list" className="divide-y divide-gray-200">
          {entries.slice(0).reverse().map((entry, entryIdx) => (
            <li key={entryIdx} className="py-4">
              <div className="flex space-x-3">
                {getMood(entry.mood)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium truncate">{entry.address}</h3>
                    <p className="text-sm text-gray-500">{entry.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {entry.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  