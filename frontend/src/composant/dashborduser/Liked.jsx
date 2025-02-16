import Breadcrumb from './Breadcrumb';

const breadcrumbItems = [
    { text: 'Liked' }
  ];
function Liked() {
  return (
    <div>
        <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}

export default Liked