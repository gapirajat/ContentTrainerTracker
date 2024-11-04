import React from 'react'

export default function RegisterExperience({props}) {
  return (
    <>
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700"
            >
              Experience (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="experience"
                name="experience"
                value={props.formData.experience}
                onChange={props.handleChange}
                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Describe your experience..."
                rows="4"
              ></textarea>
            </div>
          </div>
    </>
  )
}
