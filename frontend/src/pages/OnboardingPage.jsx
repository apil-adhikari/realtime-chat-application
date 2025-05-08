import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  Loader,
  MapPinIcon,
  ShipWheel,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants/index";

const OnboardingPage = () => {
  // GET authenticated user from custom hook
  const { authUser } = useAuthUser();

  const queryClient = useQueryClient();

  // Creating form state
  const [fromState, setFormState] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  // -- USING MUTATION ----
  const {
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      // Show the toast message
      toast.success("Profile onboarded successfully");

      // Refetch the authenticated user
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    // USING onError FOR THE ERRORS THAT WE GET IN BACKEND
    onError: (error) => {
      // console.log(error);
      toast.error(`${error.response.data.message}`);
    },
  });

  //   -- END OF MUTATION

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(fromState);
  };

  //   function to handle avatar change
  const handleRandomAvatar = () => {
    const imageIndex = Math.floor(Math.random() * 100) + 1; // INCLUDING 1 AND 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${imageIndex}.png`;

    setFormState({ ...fromState, profilePic: randomAvatar });
    setTimeout(() => {
      toast.success("Random Image generated successfully");
    }, 1000);

    console.log(fromState.profilePic);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Image Preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {fromState.profilePic ? (
                  <img
                    src={fromState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover  animate-pulse duration-100 [animation-iteration-count:1]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-accent/50 " />
                  </div>
                )}
              </div>

              {/* GENERATE RANDOM AVATAR Button */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  value={fromState.profilePic}
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control ">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={fromState.fullname}
                onChange={(e) =>
                  setFormState({ ...fromState, fullname: e.target.value })
                }
                className="input input-bordered "
                placeholder="Your full name"
              />
            </div>

            {/* BIO  */}

            <div className="form-control ">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>

              <textarea
                name="bio"
                id="bio"
                value={fromState.bio}
                onChange={(e) =>
                  setFormState({ ...fromState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning golas"
              ></textarea>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native Lanaugage */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>

                <select
                  name="nativeLanguage"
                  id="nativeLanguage"
                  onChange={(e) =>
                    setFormState({
                      ...fromState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">
                    {fromState.nativeLanguage != ""
                      ? fromState.nativeLanguage.charAt(0).toUpperCase() +
                        fromState.nativeLanguage.slice(1)
                      : "Select your native language"}
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>

                <select
                  name="learningLanguage"
                  id="learningLanguage"
                  value={fromState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...fromState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value={fromState.learningLanguage}>
                    {fromState.learningLanguage != ""
                      ? fromState.learningLanguage.charAt(0).toUpperCase() +
                        fromState.learningLanguage.slice(1)
                      : "Select language you want to learn"}
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={fromState.location}
                  onChange={(e) =>
                    setFormState({ ...fromState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* COMPLETE ONBOARDING STEP: DISPLAY THE BUTTON BASED ON THE STATE such as for pending state, use loading animations */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending} // Disable if in pending state
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="size-5 mr-2 animate-spin" />
                  OnBoarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
