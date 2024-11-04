import React from 'react'

export default function RegisterEmail({props}) {
  return (
    <>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={props.formData.email}
                onChange={props.handleChange}
                className={`appearance-none block w-full px-4 py-2 border ${
                  props.errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
                placeholder="you@example.com"
              />
            </div>
            {props.errors.email && (
              <p className="mt-2 text-sm text-red-600">{props.errors.email}</p>
            )}
          </div>
    </>
  )
}
