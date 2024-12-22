// Component to display a section of features with a title, description, and feature cards
export default function FeatureHighlight({ title, description, features }) {
    return (
        <section className="mb-16">
            {/* Header section with title and description */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-lg text-gray-600">{description}</p>
            </div>
            {/* Grid layout for feature cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Map through features array to render individual feature cards */}
                {features.map((feature, index) => (
                    <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                ))}
            </div>
        </section>
    );
}

// Component to render individual feature card with icon, title, and description
function FeatureCard({ icon, title, description }) {
    return (
        // Card container with hover effect and shadow
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-center">
            {/* Feature icon */}
            <i className={`${icon} text-blue-600 text-4xl mb-4`}></i>
            {/* Feature title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            {/* Feature description */}
            <p className="text-gray-600">{description}</p>
        </div>
    );
}