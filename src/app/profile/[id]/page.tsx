export default function ProfilePage({ params }: string) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-6xl">Profile</h1>
            <hr />
            <p className="text-xl my-2">Profie Page
                <span className="p-2 ml-2 rounded bg-blue-500 text-black">{params.id}</span>
            </p>

        </div>
    )
}